import * as utils from './utils/index';
import * as types from './utils/type';
import * as dateFns from 'date-fns';
import EventEmitter from './utils/events';

import datePicker from './datePicker';

import defaultOptions from './defaultOptions';
import template from './templates';
import templateselection from './templates/header';
import templateFooter from './templates/footer';

export default class bulmaCalendar extends EventEmitter {
  constructor(selector, options = {}) {
    super();

    this.element = types.isString(selector) ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    this._clickEvents = ['click', 'touch'];
    this._supportsPassive = utils.detectSupportsPassive();

    // Use Element dataset values to override options
    const elementConfig = this.element.dataset ? Object.keys(this.element.dataset)
      .filter(key => Object.keys(defaultOptions).includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: this.element.dataset[key]
        };
      }, {}) : {};
    // Set default options - dataset attributes are master
    this.options = {
      ...defaultOptions,
      ...options,
      ...elementConfig
    };

    this._id = utils.uuid('bulmaDatePicker');

    this._onToggle = this._onToggle.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onValidateClick = this._onValidateClick.bind(this);
    this._onTodayClick = this._onTodayClick.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onSelectDate = this._onSelectDate.bind(this);

    // Initiate plugin
    this._init();
  }

  /**
   * Initiate all DOM element containing datePicker class
   * @method
   * @return {Array} Array of all datePicker instances
   */
  static attach(selector = '.bulma-datepicker', options = {}) {
    let instances = [];

    const elements = types.isString(selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
    if (elements.length > 1) {
      [].forEach.call(elements, ement => {
        instances.push(new bulmaCalendar(ement, options));
      });
      return instances;
    } else if (elements.length === 1) {
      return new bulmaCalendar(elements[0], options);
    }
  }

  /****************************************************
   *                                                  *
   * GETTERS and SETTERS                              *
   *                                                  *
   ****************************************************/

  /**
   * Get id of current instance
   */
  get id() {
    return this._id;
  }

  // Set language
  set lang(lang = 'en') {
    try {
      this._locale = require('date-fns/locale/' + lang);
    } catch (e) {
      lang = 'en';
      this._locale = require('date-fns/locale/' + lang);
    } finally {
      this._lang = lang;
      this.datePicker.lang = lang;
      return this;
    }
  }
  // Get current language
  get lang() {
    return this._lang;
  }
  get locale() {
    return this._locale;
  }

  // Set format (set to yyyy-mm-dd HH:mm:ss by default)
  set format(format) {
    this._format = format;
    return this;
  }
  // Get format
  get format() {
    return this._format;
  }

  /**
   * * Date setter and getter
   */
  set date(date = null) {
    this.datePicker.date = date;
    return this;
  }
  // Get date object
  get date() {
    return this.datePicker.date;
  }

  set startDate(date = undefined) {
    this.datePicker.start = date;
    return this;
  }
  get startDate() {
    return this.datePicker.start;
  }

  set endDate(date = undefined) {
    this.datePicker.end = date;
    return this;
  }
  get endDate() {
    return this.datePicker.end;
  }

  /**
   * minDate getter and setters
   */
  set minDate(date = undefined) {
    this.datePicker.minDate = date;
    return this;
  }
  // Get minDate
  get minDate() {
    return this.datePicker.minDate;
  }

  // Set maxDate
  set maxDate(date = undefined) {
    this.datePicker.maxDate = date;
    return this;
  }
  // Get maxDate
  get maxDate() {
    return this.datePicker.maxDate;
  }

  // Set dateFormat (set to yyyy-mm-dd by default)
  set dateFormat(dateFormat) {
    this.datePicker.dateFormat = dateFormat;
    return this;
  }
  // Get dateFormat
  get dateFormat() {
    return this.datePicker.dateFormat;
  }

  /****************************************************
   *                                                  *
   * EVENTS FUNCTIONS                                 *
   *                                                  *
   ****************************************************/
  _onSelectDate(e) {
    this.refresh();
    this.save();
    if (e.type === 'select' && this.options.closeOnSelect && this.options.displayMode !== 'inline') {
      this.hide();
    }

    this.emit(e.type, e.data);
  }

  _onDocumentClick(e) {
    if (!this._open) {
      return;
    }
    
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    // Check is e.target not within datepicker element
    const target = e.target || e.srcElement;
    if (!this._ui.wrapper.contains(target) && this.options.displayMode !== 'inline') {
      this._onClose(e);
    }
  }

  _onToggle(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (this._open) {
      this.hide();
    } else {
      this.show();
    }
  }

  _onValidateClick(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this.save();

    if (this.options.displayMode !== 'inline') {
      this._onClose(e);
    }
  }

  _onTodayClick(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this.datePicker.value(new Date());
    this.datePicker.refresh();

    // TODO: check if closeOnSelect
    this.save();
  }

  _onClearClick(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this.clear();
  }

  _onCancelClick(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (this._snapshots.length) {
      this.datePicker = this._snapshots[0].datePicker;
    }
    this.save();
    if (this.options.displayMode !== 'inline') {
      this._onClose(e);
    }
  }

  _onClose(e) {
    if (!this._supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this.hide();
  }

  /****************************************************
   *                                                  *
   * PUBLIC FUNCTIONS                                 *
   *                                                  *
   ****************************************************/
  isRange() {
    return this.options.isRange;
  }

  /**
   * Returns true if datetime picker is open, otherwise false.
   * @method isOpen
   * @return {boolean}
   */
  isOpen() {
    return this._open;
  }

  /**
   * Get / Set ement value
   * @param {*} date 
   */
  value(value = null) {
    if (value) {
      this.datePicker.value(value);
      this.refresh();
    } else {
      return this.datePicker.value();
    }
  }

  refresh() {
    this._ui.header.start.day.innerHTML = this.datePicker.start ? dateFns.format(this.datePicker.start, 'DD', {
      locale: this.locale
    }) : '--';
    this._ui.header.start.month.innerHTML = this.datePicker.start ? dateFns.format(this.datePicker.start, 'MMMM YYYY', {
      locale: this.locale
    }) : '';
    if (this.datePicker.start) {
      this._ui.header.start.weekday.classList.remove('is-hidden');
      this._ui.header.start.weekday.innerHTML = this.datePicker.start ? dateFns.format(this.datePicker.start, 'dddd', {
        locale: this.locale
      }) : '';
    } else {
      this._ui.header.start.weekday.classList.add('is-hidden');
    }

    if (this._ui.header.end) {
      this._ui.header.end.day.innerHTML = this.options.isRange && this.datePicker.end ? dateFns.format(this.datePicker.end, 'DD', {
        locale: this.locale
      }) : '--';
      this._ui.header.end.month.innerHTML = this.options.isRange && this.datePicker.end ? dateFns.format(this.datePicker.end, 'MMMM YYYY', {
        locale: this.locale
      }) : '';
      if (this.datePicker.end) {
        this._ui.header.end.weekday.classList.remove('is-hidden');
        this._ui.header.end.weekday.innerHTML = this.datePicker.end ? dateFns.format(this.datePicker.end, 'dddd', {
          locale: this.locale
        }) : '';
      } else {
        this._ui.header.end.weekday.classList.add('is-hidden');
      }
    }
    this.datePicker.refresh();
    this.emit('refresh', this);
  }

  clear() {
    this.datePicker.clear();

    this.refresh();
    this.element.value = '';
    this.emit('clear', this);
  }

  /**
   * Show datePicker HTML Component
   * @method show
   * @return {void}
   */
  show() {
    this._snapshots = [];
    this.snapshot();

    if (this.element.value) {
      this.datePicker.value(this.element.value);
      this.refresh();
    }

    this.datePicker.show();

    if (this._ui.modal) {
      this._ui.modal.classList.add('is-active');
    }
    this._ui.wrapper.classList.add('is-active');
    this._open = true;
    this.emit('show', this);
  }

  /**
   * Hide datePicker HTML Component
   * @method hide
   * @return {void}
   */
  hide() {
    this._open = false;
    this._focus = false;
    if (this._ui.modal) {
      this._ui.modal.classList.remove('is-active');
    }
    this._ui.wrapper.classList.remove('is-active');
    this.emit('hide', this);
  }

  // Set element value to datetime selected based on format
  save() {
    const date = this.value();
    this.element.value = date;
  }

  snapshot() {
    // this._snapshots.push([
    //   ...this.datePicker,
    //   ...this.timePicker
    // ]);
  }

  /**
   * Destroy datePicker
   * @method destroy
   * @return {[type]} [description]
   */
  destroy() {
    this._ui.wrapper.remove();
  }

  /****************************************************
   *                                                  *
   * PRIVATE FUNCTIONS                                *
   *                                                  *
   ****************************************************/
  /**
   * Initiate plugin instance
   * @method _init
   * @return {datePicker} Current plugin instance
   */
  _init() {
    if (types.isFunction(this.options.onReady)) {
      this.on('ready', this.options.onReady);
    }

    this._open = false;
    this._snapshots = []; // Use to revert selection
    // Change element type to prevent browser default type="date" behavior
    this.element.setAttribute('type', 'text');
    this.datePicker = new datePicker({
      ...this.options,
      lang: this.lang
    });

    if (this.element.value) {
      this.datePicker.value(this.element.value);
    }

    this.lang = this.options.lang;
    // Set export format based on component type
    this.format = this._type === 'date' ? this.options.dateFormat : `${this.options.dateFormat}`;

    // Force dialog display mode on mobile devices
    if (this.options.displayMode === 'default' && window.matchMedia('screen and (max-width: 768px)').matches) {
      this.options.displayMode = 'dialog';
    }
    if (window.matchMedia('screen and (max-width: 768px)').matches) {
      if (this.options.displayMode === 'default') {
        this.options.displayMode = 'dialog';
      }
      this.options.displayDual = false;
    }

    this._build();
    this._bindEvents();
    this.save();

    this.emit('ready', this);
  }

  /**
   * Build datePicker HTML component and bulmaCalendarend it to the DOM
   * @method _build
   * @return {datePicker} Current plugin instance
   */
  _build() {
    const headerNode = document.createRange().createContextualFragment(templateselection({
      ...this.options,
      type: this._type,
      datePicker: this.options.type !== 'time'
    }));
    const footerNode = document.createRange().createContextualFragment(templateFooter(this.options));
    const elementNode = document.createRange().createContextualFragment(template({
      ...this.options,
      id: this.id
    }));

    // Save pointer to each datePicker element for later use
    this._ui = {
      modal: elementNode.querySelector('.modal'),
      wrapper: elementNode.querySelector('.bulma-datepicker'),
      container: elementNode.querySelector('.bulma-datepicker-container'),
      calendar: elementNode.querySelector('.ement'),
      overlay: this.options.displayMode === 'dialog' ? {
        background: elementNode.querySelector('.modal-background'),
        close: elementNode.querySelector('.modal-close')
      } : undefined,
      header: {
        container: headerNode.querySelector('.bulma-datepicker-header'),
        start: {
          container: headerNode.querySelector('.bulma-datepicker-selection-start'),
          day: headerNode.querySelector('.bulma-datepicker-selection-start .bulma-datepicker-selection-day'),
          month: headerNode.querySelector('.bulma-datepicker-selection-start .bulma-datepicker-selection-month'),
          weekday: headerNode.querySelector('.bulma-datepicker-selection-start .bulma-datepicker-selection-weekday'),
          empty: headerNode.querySelector('.bulma-datepicker-selection-start .empty')
        },
        end: this.options.isRange ? {
          container: headerNode.querySelector('.bulma-datepicker-selection-end'),
          day: headerNode.querySelector('.bulma-datepicker-selection-end .bulma-datepicker-selection-day'),
          month: headerNode.querySelector('.bulma-datepicker-selection-end .bulma-datepicker-selection-month'),
          weekday: headerNode.querySelector('.bulma-datepicker-selection-end .bulma-datepicker-selection-weekday'),
          empty: headerNode.querySelector('.bulma-datepicker-selection-start .empty')
        } : undefined
      },
      footer: {
        container: footerNode.querySelector('.bulma-datepicker-footer'),
        validate: footerNode.querySelector('.bulma-datepicker-footer-validate'),
        today: footerNode.querySelector('.bulma-datepicker-footer-today'),
        clear: footerNode.querySelector('.bulma-datepicker-footer-clear'),
        cancel: footerNode.querySelector('.bulma-datepicker-footer-cancel'),
      }
    };

    if (!this.options.showHeader) {
      this._ui.header.container.classList.add('is-hidden');
    }
    if (!this.options.showFooter) {
      this._ui.footer.container.classList.add('is-hidden');
    }
    if (!this.options.showTodayButton) {
      this._ui.footer.today.classList.add('is-hidden');
    }
    if (!this.options.showClearButton) {
      this._ui.footer.clear.classList.add('is-hidden');
    }

    if (this.options.closeOnSelect && this._ui.footer.validate) {
      this._ui.footer.validate.classList.add('is-hidden');
    }

    this._ui.container.appendChild(headerNode);
    this._ui.container.appendChild(this.datePicker.render());

    this._ui.wrapper.appendChild(footerNode);
    this._ui.wrapper.classList.add(`is-${this.options.color}`);
    // Add datepicker HTML element to Document Body
    this.element.parentNode.insertBefore(elementNode, this.element.nextSibling);
    // this.element.classList.add('is-hidden');

    if (this.element.getAttribute('type') === 'date') {
      this.element.setAttributes('type', 'text');
    }

    if (this.options.displayMode === 'inline') {
      this._ui.wrapper.classList.add('is-active');
      this.element.classList.add('is-hidden');
    } else {
      this._ui.wrapper.style.position = 'absolute';
      this._ui.wrapper.classList.add('is-datetimepicker-default');
    }
    this.refresh();
  }

  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    this._clickEvents.forEach(clickEvent => {
      document.body.addEventListener(clickEvent, this._onDocumentClick);
    });

    this.datePicker.on('select', this._onSelectDate);
    this.datePicker.on('select:start', this._onSelectDate);
    this.datePicker.on('select:end', this._onSelectDate);

    // Bind event to element in order to display/hide datePicker on click
    if (this.options.toggleOnInputClick === true) {
      this._clickEvents.forEach(clickEvent => {
        this.element.addEventListener(clickEvent, this._onToggle);
      });
    }

    if (this.options.displayMode === 'dialog' && this._ui.overlay) {
      // Bind close event on Close button
      if (this._ui.overlay.close) {
        this._clickEvents.forEach(clickEvent => {
          this.this._ui.overlay.close.addEventListener(clickEvent, this._onClose);
        });
      }
      // Bind close event on overlay based on options
      if (this.options.closeOnOverlayClick && this._ui.overlay.background) {
        this._clickEvents.forEach(clickEvent => {
          this._ui.overlay.background.addEventListener(clickEvent, this._onClose);
        });
      }
    }

    if (this._ui.footer.validate) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.validate.addEventListener(clickEvent, this._onValidateClick);
      });
    }
    if (this._ui.footer.today) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.today.addEventListener(clickEvent, this._onTodayClick);
      });
    }
    if (this._ui.footer.clear) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.clear.addEventListener(clickEvent, this._onClearClick);
      });
    }
    this._clickEvents.forEach(clickEvent => {
      // this._ui.dummy.clear.addEventListener(clickEvent, this._onClearClick);
    });
    if (this._ui.footer.cancel) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.cancel.addEventListener(clickEvent, this._onCancelClick);
      });
    }
  }
}
