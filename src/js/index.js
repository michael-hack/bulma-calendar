import * as utils from './utils/index';
import * as types from './utils/type';
import * as dateFns from 'date-fns';

import EventEmitter from './utils/events';
import defaultOptions from './defaultOptions';
import templateCalendar from './templates/calendar';
import templateDays from './templates/days';

const onToggleDatePicker = Symbol('onToggleDatePicker');
const onCloseDatePicker = Symbol('onCloseDatePicker');
const onPreviousDatePicker = Symbol('onPreviousDatePicker');
const onNextDatePicker = Symbol('onNextDatePicker');
const onSelectMonthDatePicker = Symbol('onSelectMonthDatePicker');
const onMonthClickDatePicker = Symbol('onMonthClickDatePicker');
const onSelectYearDatePicker = Symbol('onSelectYearDatePicker');
const onYearClickDatePicker = Symbol('onYearClickDatePicker');
const onDateClickDatePicker = Symbol('onDateClickDatePicker');
const onDocumentClickDatePicker = Symbol('onDocumentClickDatePicker');
const onValidateClickDatePicker = Symbol('onValidateClickDatePicker');
const onTodayClickDatePicker = Symbol('onTodayClickDatePicker');
const onClearClickDatePicker = Symbol('onClearClickDatePicker');
const onCancelClickDatePicker = Symbol('onCancelClickDatePicker');

let _supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: () => {
      _supportsPassive = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

export default class bulmaCalendar extends EventEmitter {
  constructor(selector, options = {}) {
    super();

    this.element = types.isString(selector) ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    this._clickEvents = ['click', 'touch'];

    /// Set default options and merge with instance defined
    this.options = {
      ...defaultOptions,
      ...options
    };

    this[onToggleDatePicker] = this[onToggleDatePicker].bind(this);
    this[onCloseDatePicker] = this[onCloseDatePicker].bind(this);
    this[onPreviousDatePicker] = this[onPreviousDatePicker].bind(this);
    this[onNextDatePicker] = this[onNextDatePicker].bind(this);
    this[onSelectMonthDatePicker] = this[onSelectMonthDatePicker].bind(this);
    this[onMonthClickDatePicker] = this[onMonthClickDatePicker].bind(this);
    this[onSelectYearDatePicker] = this[onSelectYearDatePicker].bind(this);
    this[onYearClickDatePicker] = this[onYearClickDatePicker].bind(this);
    this[onDateClickDatePicker] = this[onDateClickDatePicker].bind(this);
    this[onDocumentClickDatePicker] = this[onDocumentClickDatePicker].bind(this);
    this[onValidateClickDatePicker] = this[onValidateClickDatePicker].bind(this);
    this[onTodayClickDatePicker] = this[onTodayClickDatePicker].bind(this);
    this[onClearClickDatePicker] = this[onClearClickDatePicker].bind(this);
    this[onCancelClickDatePicker] = this[onCancelClickDatePicker].bind(this);

    // Initiate plugin
    this._init();
  }

  /**
   * Initiate all DOM element containing datePicker class
   * @method
   * @return {Array} Array of all datePicker instances
   */
  static attach(selector = 'input[type="date"]', options = {}) {
    let datepickerInstances = new Array();

    const datepickers = types.isString(selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
    [].forEach.call(datepickers, datepicker => {
      datepickerInstances.push(new bulmaCalendar(datepicker, options));
    });
    return datepickerInstances;
  }

  /****************************************************
   *                                                  *
   * GETTERS and SETTERS                              *
   *                                                  *
   ****************************************************/

  /**
   * Get id of current datePicker
   */
  get id() {
    return this._id;
  }

  // Get current datePicker language
  get lang() {
    return this._lang;
  }

  // Set datePicker language
  set lang(lang = 'en') {
    this._lang = lang;
    this._locale = require('date-fns/locale/' + lang);
  }

  get locale() {
    return this._locale;
  }

  // Get date object
  get date() {
    return this._date || {
      start: undefined,
      end: undefined
    };
  }

  get startDate() {
    return this._date.start;
  }

  get endDate() {
    return this._date.end;
  }

  set startDate(date) {
    this._date.start = date ? (this._isValidDate(date, this.minDate, this.maxDate) ? dateFns.startOfDay(date) : this._date.start) : undefined;
  }

  set endDate(date) {
    this._date.end = date ? (this._isValidDate(date, this.minDate, this.maxDate) ? dateFns.startOfDay(date) : this._date.end) : undefined;
  }

  // Get minDate
  get minDate() {
    return this._minDate;
  }

  // Set minDate
  set minDate(date = undefined) {
    this._minDate = date ? (this._isValidDate(date) ? dateFns.startOfDay(date) : this._minDate) : undefined;
    return this;
  }

  // Get maxDate
  get maxDate() {
    return this._maxDate;
  }

  // Set maxDate
  set maxDate(date = null) {
    this._maxDate = date ? (this._isValidDate(date) ? dateFns.startOfDay(date) : this._maxDate) : undefined;
    return this;
  }

  // Get dateFormat
  get dateFormat() {
    return this._dateFormat;
  }

  // Set dateFormat (set to yyyy-mm-dd by default)
  set dateFormat(dateFormat) {
    this._dateFormat = dateFormat;
    return this;
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
   * Returns true if calendar picker is open, otherwise false.
   * @method isOpen
   * @return {boolean}
   */
  isOpen() {
    return this._open;
  }

  /**
   * Get / Set datePicker value
   * @param {*} date 
   */
  value(date = null) {
    if (date) {
      if (this.options.isRange) {
        const dates = this.element.value.split(' - ');
        if (dates.length) {
          this.startDate = new Date(dates[0]);
        }
        if (dates.length === 2) {
          this.endDate = new Date(dates[1]);
        }
      } else {
        this.startDate = new Date(this.element.value);
      }
    } else {
      let value = '';
      if (this.options.isRange) {
        if (this.startDate && this._isValidDate(this.startDate) && this.endDate && this._isValidDate(this.endDate)) {
          value = `${dateFns.format(this.startDate, this.dateFormat, { locale: this.locale })} - ${dateFns.format(this.endDate, this.dateFormat, { locale: this.locale })}`;
        }
      } else if (this.startDate && this._isValidDate(this.startDate)) {
        value = dateFns.format(this.startDate, this._dateFormat, {
          locale: this.locale
        });
      }
      this.emit('date:selected', this.date, this);
      return value;
    }
  }

  clear() {
    this._clear();
  }

  /**
   * Show datePicker HTML Component
   * @method show
   * @return {void}
   */
  show() {
    this._snapshots = [];
    this._snapshot();
    if (this.element.value) {
      this.value(this.element.value);
    }
    this._visibleDate = this._isValidDate(this.startDate, this.minDate, this.maxDate) ? this.startDate : this._visibleDate;
    this._refreshCalendar();
    this._ui.body.dates.classList.add('is-active');
    this._ui.body.months.classList.remove('is-active');
    this._ui.body.years.classList.remove('is-active');
    this._ui.navigation.previous.removeAttribute('disabled');
    this._ui.navigation.next.removeAttribute('disabled');
    this._ui.container.classList.add('is-active');
    if (this.options.displayMode === 'default') {
      this._adjustPosition();
    }
    this._open = true;
    this._focus = true;

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
    this._ui.container.classList.remove('is-active');
    this.emit('hide', this);
  }

  /**
   * Destroy datePicker
   * @method destroy
   * @return {[type]} [description]
   */
  destroy() {
    this._ui.container.remove();
  }

  /****************************************************
   *                                                  *
   * EVENTS FUNCTIONS                                 *
   *                                                  *
   ****************************************************/
  [onDocumentClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (this.options.displayMode !== 'inline' && this._open) {
      this[onCloseDatePicker](e);
    }
  }

  [onToggleDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (this._open) {
      this.hide();
    } else {
      this.show();
    }
  }

  [onValidateClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this[onCloseDatePicker](e);
  }

  [onTodayClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (!this.options.isRange) {
      this.startDate = new Date();
      this._visibleDate = this.startDate;
    } else {
      this._setStartAndEnd(new Date());
      this._visibleDate = this.startDate;
    }
    this.element.value = this.value();
    this._refreshCalendar();
  }

  [onClearClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this._clear();
  }

  [onCancelClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (this._snapshots.length) {
      this.startDate = this._snapshots[0].start;
      this.endDate = this._snapshots[0].end;
    }
    this.element.value = this.value();
    this[onCloseDatePicker](e);
  }

  [onCloseDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    this.hide();
  }

  [onPreviousDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();


    const prevMonth = dateFns.lastDayOfMonth(dateFns.subMonths(new Date(dateFns.getYear(this._visibleDate), dateFns.getMonth(this._visibleDate)), 1));
    const day = Math.min(dateFns.getDaysInMonth(prevMonth), dateFns.getDate(this._visibleDate));
    this._visibleDate = this.minDate ? dateFns.max(dateFns.setDate(prevMonth, day), this.minDate) : dateFns.setDate(prevMonth, day);

    this._refreshCalendar();
  }

  [onNextDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    const nextMonth = dateFns.addMonths(this._visibleDate, 1);
    const day = Math.min(dateFns.getDaysInMonth(nextMonth), dateFns.getDate(this._visibleDate));
    this._visibleDate = this.maxDate ? dateFns.min(dateFns.setDate(nextMonth, day), this.maxDate) : dateFns.setDate(nextMonth, day);

    this._refreshCalendar();
  }

  [onDateClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (!e.currentTarget.classList.contains('is-disabled')) {
      this._setStartAndEnd(e.currentTarget.dataset.date);

      this._refreshCalendar();
      if (this.options.displayMode === 'inline' || this.options.closeOnSelect) {
        this.element.value = this.value();
      }

      if ((!this.options.isRange || (this.startDate && this._isValidDate(this.startDate) && this.endDate && this._isValidDate(this.endDate))) && this.options.closeOnSelect) {
        this.hide();
      }
    }
  }

  [onSelectMonthDatePicker](e) {
    e.stopPropagation();
    this._ui.body.dates.classList.remove('is-active');
    this._ui.body.years.classList.remove('is-active');
    this._ui.body.months.classList.add('is-active');
    this._ui.navigation.previous.setAttribute('disabled', 'disabled');
    this._ui.navigation.next.setAttribute('disabled', 'disabled');
  }

  [onSelectYearDatePicker](e) {
    e.stopPropagation();

    this._ui.body.dates.classList.remove('is-active');
    this._ui.body.months.classList.remove('is-active');
    this._ui.body.years.classList.add('is-active');
    this._ui.navigation.previous.setAttribute('disabled', 'disabled');
    this._ui.navigation.next.setAttribute('disabled', 'disabled');

    const currentYear = this._ui.body.years.querySelector('.calendar-year.is-active');
    if (currentYear) {
      this._ui.body.years.scrollTop = currentYear.offsetTop - this._ui.body.years.offsetTop - (this._ui.body.years.clientHeight / 2);
    }
  }

  [onMonthClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }

    e.stopPropagation();
    const newDate = dateFns.setMonth(this._visibleDate, parseInt(e.currentTarget.dataset.month) - 1);
    this._visibleDate = this.minDate ? dateFns.max(newDate, this.minDate) : newDate;
    this._visibleDate = this.maxDate ? dateFns.min(this._visibleDate, this.maxDate) : this._visibleDate;

    this._refreshCalendar();
  }

  [onYearClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }

    e.stopPropagation();
    const newDate = dateFns.setYear(this._visibleDate, parseInt(e.currentTarget.dataset.year));
    this._visibleDate = this.minDate ? dateFns.max(newDate, this.minDate) : newDate;
    this._visibleDate = this.maxDate ? dateFns.min(this._visibleDate, this.maxDate) : this._visibleDate;

    this._refreshCalendar();
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
    this._id = utils.uuid('datePicker');
    this._snapshots = [];

    // Cahnge element type to prevent browser default type="date" behavior
    if (this.element.getAttribute('type').toLowerCase() === 'date') {
      this.element.setAttribute('type', 'text');
    }

    // Use Element dataset values to override options
    const elementConfig = this.element.dataset ? Object.keys(this.element.dataset)
      .filter(key => Object.keys(defaultOptions).includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: this.element.dataset[key]
        };
      }, {}) : {};
    this.options = {
      ...this.options,
      ...elementConfig
    };

    this.lang = this.options.lang;
    this.dateFormat = this.options.dateFormat || 'MM/DD/YYYY';
    this._date = {
      start: undefined,
      end: undefined
    };
    this._open = false;
    if (this.options.displayMode !== 'inline' && window.matchMedia('screen and (max-width: 768px)').matches) {
      this.options.displayMode = 'dialog';
    }

    this._initDates();
    this._build();
    this._bindEvents();

    this.emit('ready', this);

    return this;
  }

  // Init dates used by datePicker core system
  _initDates() {
    // Transform start date according to dateFormat option
    this.minDate = this.options.minDate;
    this.maxDate = this.options.maxDate;

    const today = new Date();
    const startDateToday = this._isValidDate(today, this.options.minDate, this.options.maxDate) ? today : this.options.minDate;

    this.startDate = this.options.startDate;
    this.endDate = this.options.isRange ? this.options.endDate : undefined;

    if (this.element.value) {
      if (this.options.isRange) {
        const dates = this.element.value.split(' - ');
        if (dates.length) {
          this.startDate = new Date(dates[0]);
        }
        if (dates.length === 2) {
          this.endDate = new Date(dates[1]);
        }
      } else {
        this.startDate = new Date(this.element.value);
      }
    }
    this._visibleDate = this._isValidDate(this.startDate) ? this.startDate : startDateToday;

    if (this.options.disabledDates) {
      if (!Array.isArray(this.options.disabledDates)) {
        this.options.disabledDates = [this.options.disabledDates];
      }
      for (var i = 0; i < this.options.disabledDates.length; i++) {
        this.options.disabledDates[i] = dateFns.format(this.options.disabledDates[i], this.options.dateFormat, {
          locale: this.locale
        });
      }
    }

    this._snapshot();
  }

  /**
   * Build datePicker HTML component and append it to the DOM
   * @method _build
   * @return {datePicker} Current plugin instance
   */
  _build() {
    // the 7 days of the week (Sun-Sat)
    const labels = new Array(7).fill(dateFns.startOfWeek(this._visibleDate)).map((d, i) => dateFns.format(dateFns.addDays(d, i + this.options.weekStart), 'ddd', {
      locale: this.locale
    }));
    // the 12 months of the year (Jan-SDecat)
    const months = new Array(12).fill(dateFns.startOfWeek(this._visibleDate)).map((d, i) => dateFns.format(dateFns.addMonths(d, i), 'MM', {
      locale: this.locale
    }));
    // the 7 days of the week (Sun-Sat)
    const years = new Array(100).fill(dateFns.subYears(this._visibleDate, 50)).map((d, i) => dateFns.format(dateFns.addYears(d, i), 'YYYY', {
      locale: this.locale
    }));

    // Create datePicker HTML Fragment based on Template
    const datePickerFragment = document.createRange().createContextualFragment(templateCalendar({
      ...this.options,
      id: this.id,
      date: this.date,
      locale: this.locale,
      visibleDate: this._visibleDate,
      labels: {
        from: this.options.labelFrom,
        to: this.options.labelTo,
        weekdays: labels
      },
      months: months,
      years: years,
      isRange: this.options.isRange,
      month: dateFns.format(this.month, 'MM', {
        locale: this.locale
      })
    }));

    // Save pointer to each datePicker element for later use
    const container = datePickerFragment.querySelector('#' + this.id);
    this._ui = {
      container: container,
      calendar: container.querySelector('.calendar'),
      overlay: this.options.displayMode === 'dialog' ? {
        background: container.querySelector('.modal-background'),
        close: container.querySelector('.modal-close')
      } : undefined,
      header: {
        container: container.querySelector('.calendar-header'),
        start: {
          container: container.querySelector('.calendar-selection-start'),
          day: container.querySelector('.calendar-selection-start .calendar-selection-day'),
          month: container.querySelector('.calendar-selection-start .calendar-selection-month'),
          weekday: container.querySelector('.calendar-selection-start .calendar-selection-weekday'),
          empty: container.querySelector('.calendar-selection-start .empty')
        },
        end: this.options.isRange ? {
          container: container.querySelector('.calendar-selection-end'),
          day: container.querySelector('.calendar-selection-end .calendar-selection-day'),
          month: container.querySelector('.calendar-selection-end .calendar-selection-month'),
          weekday: container.querySelector('.calendar-selection-end .calendar-selection-weekday'),
          empty: container.querySelector('.calendar-selection-start .empty')
        } : undefined
      },
      navigation: {
        container: container.querySelector('.calendar-nav'),
        previous: container.querySelector('.calendar-nav-previous'),
        next: container.querySelector('.calendar-nav-next'),
        month: container.querySelector('.calendar-nav-month'),
        year: container.querySelector('.calendar-nav-year')
      },
      footer: {
        container: container.querySelector('.calendar-footer'),
        validate: container.querySelector('.calendar-footer-validate'),
        today: container.querySelector('.calendar-footer-today'),
        clear: container.querySelector('.calendar-footer-clear'),
        cancel: container.querySelector('.calendar-footer-cancel'),
      },
      body: {
        dates: container.querySelector('.calendar-dates'),
        days: container.querySelector('.calendar-days'),
        weekdays: container.querySelector('.calendar-weekdays'),
        months: container.querySelector('.calendar-months'),
        years: container.querySelector('.calendar-years')
      }
    };

    if (!this.options.showHeader) {
      this._ui.header.container.classList.add('is-hidden');
    }
    if (!this.options.showFooter) {
      this._ui.footer.container.classList.add('is-hidden');
    }
    if (!this.options.todayButton) {
      this._ui.footer.todayB.classList.add('is-hidden');
    }
    if (!this.options.clearButton) {
      this._ui.footer.clear.classList.add('is-hidden');
    }

    if (this.options.displayMode === 'inline' && this._ui.footer.validate) {
      this._ui.footer.validate.classList.add('is-hidden');
    }
    if (this.options.displayMode === 'inline' && this._ui.footer.cancel) {
      this._ui.footer.cancel.classList.add('is-hidden');
    }
    if (this.options.closeOnSelect && this._ui.footer.validate) {
      this._ui.footer.validate.classList.add('is-hidden');
    }

    // Add datepicker HTML element to Document Body
    if (this.options.displayMode === 'inline') {
      const wrapper = document.createElement('div');
      this.element.parentNode.insertBefore(wrapper, this.element);
      wrapper.appendChild(this.element);
      this.element.classList.add('is-hidden');
      wrapper.appendChild(datePickerFragment);
      container.classList.remove('datepicker');
      this._refreshCalendar();
    } else {
      document.body.appendChild(datePickerFragment);
    }
  }

  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    // Bind event to element in order to display/hide datePicker on click
    // this._clickEvents.forEach(clickEvent => {
    //   window.addEventListener(clickEvent, this[onDocumentClickDatePicker]);
    // });
    window.addEventListener('scroll', () => {
      if (this.options.displayMode === 'default') {
        console('Scroll');
        this._adjustPosition();
      }
    });

    document.addEventListener('keydown', e => {
      if (this._focus) {
        switch (e.keyCode || e.which) {
          case 37:
            this[onPreviousDatePicker](e);
            break;
          case 39:
            this[onNextDatePicker](e);
            break;
        }
      }
    });

    // Bind event to element in order to display/hide datePicker on click
    if (this.options.toggleOnInputClick === true) {
      this._clickEvents.forEach(clickEvent => {
        this.element.addEventListener(clickEvent, this[onToggleDatePicker]);
      });
    }

    if (this.options.displayMode === 'dialog' && this._ui.overlay) {
      // Bind close event on Close button
      if (this._ui.overlay.close) {
        this._clickEvents.forEach(clickEvent => {
          this.this._ui.overlay.close.addEventListener(clickEvent, this[onCloseDatePicker]);
        });
      }
      // Bind close event on overlay based on options
      if (this.options.closeOnOverlayClick && this._ui.overlay.background) {
        this._clickEvents.forEach(clickEvent => {
          this._ui.overlay.background.addEventListener(clickEvent, this[onCloseDatePicker]);
        });
      }
    }

    // Bind year navigation events
    if (this._ui.navigation.previous) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.navigation.previous.addEventListener(clickEvent, this[onPreviousDatePicker]);
      });
    }
    if (this._ui.navigation.next) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.navigation.next.addEventListener(clickEvent, this[onNextDatePicker]);
      });
    }

    if (this._ui.navigation.month) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.navigation.month.addEventListener(clickEvent, this[onSelectMonthDatePicker]);
      });
    }
    if (this._ui.navigation.year) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.navigation.year.addEventListener(clickEvent, this[onSelectYearDatePicker]);
      });
    }

    const months = this._ui.body.months.querySelectorAll('.calendar-month') || [];
    months.forEach(month => {
      this._clickEvents.forEach(clickEvent => {
        month.addEventListener(clickEvent, this[onMonthClickDatePicker]);
      });
    });

    const years = this._ui.body.years.querySelectorAll('.calendar-year') || [];
    years.forEach(year => {
      this._clickEvents.forEach(clickEvent => {
        year.addEventListener(clickEvent, this[onYearClickDatePicker]);
      });
    });

    if (this._ui.footer.validate) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.validate.addEventListener(clickEvent, this[onValidateClickDatePicker]);
      });
    }
    if (this._ui.footer.today) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.today.addEventListener(clickEvent, this[onTodayClickDatePicker]);
      });
    }
    if (this._ui.footer.clear) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.clear.addEventListener(clickEvent, this[onClearClickDatePicker]);
      });
    }
    if (this._ui.footer.cancel) {
      this._clickEvents.forEach(clickEvent => {
        this._ui.footer.cancel.addEventListener(clickEvent, this[onCancelClickDatePicker]);
      });
    }
  }

  /**
   * Bind events on each Day item
   * @method _bindDaysEvents
   * @return {void}
   */
  _bindDaysEvents() {
    [].forEach.call(this._ui.days, (day) => {
      this._clickEvents.forEach(clickEvent => {
        // if not in range, no click action
        // if in this month, select the date
        // if out of this month, jump to the date
        const onClick = !this._isValidDate(new Date(day.dataset.date), this.minDate, this.maxDate) ? null : this[onDateClickDatePicker];
        day.addEventListener(clickEvent, onClick);
      });

      day.addEventListener('hover', e => {
        e.preventDEfault();
      });
    });
  }

  _renderDays() {
    // first day of current month view
    const start = dateFns.startOfWeek(dateFns.startOfMonth(this._visibleDate));
    // last day of current month view
    const end = dateFns.endOfWeek(dateFns.endOfMonth(this._visibleDate));

    // get all days and whether they are within the current month and range
    const days = new Array(dateFns.differenceInDays(end, start) + 1)
      .fill(start)
      .map((s, i) => {
        const theDate = dateFns.addDays(s, i + this.options.weekStart);
        const isThisMonth = dateFns.isSameMonth(this._visibleDate, theDate);
        const isInRange = this.options.isRange && dateFns.isWithinRange(theDate, this.startDate, this.endDate);
        let isDisabled = this.maxDate ? dateFns.isAfter(theDate, this.maxDate) : false;
        isDisabled = this.minDate ? dateFns.isBefore(theDate, this.minDate) : isDisabled;

        if (this.options.disabledDates) {
          for (let j = 0; j < this.options.disabledDates.length; j++) {
            if (dateFns.getTime(theDate) == dateFns.getTime(this.options.disabledDates[j])) {
              isDisabled = true;
            }
          }
        }

        if (this.options.disabledWeekDays) {
          const disabledWeekDays = types.isString(this.options.disabledWeekDays) ? this.options.disabledWeekDays.split(',') : this.options.disabledWeekDays;
          disabledWeekDays.forEach(day => {
            if (dateFns.getDay(theDate) == day) {
              isDisabled = true;
            }
          });
        }

        return {
          date: theDate,
          isRange: this.options.isRange,
          isToday: dateFns.isToday(theDate),
          isStartDate: dateFns.isEqual(this.startDate, theDate),
          isEndDate: dateFns.isEqual(this.endDate, theDate),
          isDisabled: isDisabled,
          isThisMonth,
          isInRange
        };
      });

    this._ui.body.days.appendChild(document.createRange().createContextualFragment(templateDays(days)));
    this._ui.days = this._ui.body.days.querySelectorAll('.calendar-date');
    this._bindDaysEvents();

    this.emit('rendered', this);
  }

  _togglePreviousButton(active = true) {
    if (!active) {
      this._ui.navigation.previous.setAttribute('disabled', 'disabled');
    } else {
      this._ui.navigation.previous.removeAttribute('disabled');
    }
  }

  _toggleNextButton(active = true) {
    if (!active) {
      this._ui.navigation.next.setAttribute('disabled', 'disabled');
    } else {
      this._ui.navigation.next.removeAttribute('disabled');
    }
  }

  _setStartAndEnd(date) {
    this._snapshot();
    if (this.options.isRange && (!this._isValidDate(this.startDate) || (this._isValidDate(this.startDate) && this._isValidDate(this.endDate)))) {
      this.startDate = new Date(date);
      this.endDate = undefined;
      this.emit('startDate:selected', this.date, this);
    } else if (this.options.isRange && !this._isValidDate(this.endDate)) {
      if (dateFns.isBefore(date, this.startDate)) {
        this.endDate = this.startDate;
        this.startDate = new Date(date);
        this.emit('startDate:selected', this.date, this);
        this.emit('endDate:selected', this.date, this);
      } else if (dateFns.isAfter(date, this.startDate)) {
        this.endDate = new Date(date);
        this.emit('endDate:selected', this.date, this);
      } else {
        this.startDate = new Date(date);
        this.endDate = undefined;
      }
    } else {
      this.startDate = new Date(date);
      this.endDate = undefined;
    }

    if (this.options.isRange && this._isValidDate(this.startDate) && this._isValidDate(this.endDate)) {
      new Array(dateFns.differenceInDays(this.endDate, this.startDate) + 1)
        .fill(this.startDate)
        .map((s, i) => {
          const theDate = dateFns.addDays(s, i);
          const dateElement = this._ui.body.dates.querySelector(`.calendar-date[data-date="${theDate.toString()}"]`);
          if (dateElement) {
            if (dateFns.isEqual(this.startDate, theDate)) {
              dateElement.classList.add('calendar-range-start');
            }
            if (dateFns.isEqual(this.endDate, theDate)) {
              dateElement.classList.add('calendar-range-end');
            }
            dateElement.classList.add('calendar-range');
          }
        });
    }
  }

  _clear() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.element.value = this.value();
    if (this.options.displayMode !== 'inline' && this._open) {
      this.hide();
    }
    this._refreshCalendar();
  }

  /**
   * Refresh calendar with new year/month days
   * @method _refreshCalendar
   * @return {[type]}        [description]
   */
  _refreshCalendar() {
    // this.elementCalendarNavDay.innerHTML = this.date.date();
    this._ui.body.days.innerHTML = '';

    if (this.minDate && dateFns.differenceInMonths(this._visibleDate, this.minDate) === 0) {
      this._togglePreviousButton(false);
    } else {
      this._togglePreviousButton();
    }

    if (this.maxDate && dateFns.differenceInMonths(this._visibleDate, this.maxDate) === 0) {
      this._toggleNextButton(false);
    } else {
      this._toggleNextButton();
    }

    this._refreshCalendarHeader();

    this._ui.navigation.month.innerHTML = dateFns.format(this._visibleDate, 'MMMM', {
      locale: this.locale
    });
    this._ui.navigation.year.innerHTML = dateFns.format(this._visibleDate, 'YYYY', {
      locale: this.locale
    });

    const months = this._ui.body.months.querySelectorAll('.calendar-month') || [];
    months.forEach(month => {
      month.classList.remove('is-active');
      if (month.dataset.month === dateFns.format(this._visibleDate, 'MM', {
          locale: this.locale
        })) {
        month.classList.add('is-active');
      }
    });
    const years = this._ui.body.years.querySelectorAll('.calendar-year') || [];
    years.forEach(year => {
      year.classList.remove('is-active');
      if (year.dataset.year === dateFns.format(this._visibleDate, 'YYYY', {
          locale: this.locale
        })) {
        year.classList.add('is-active');
      }
    });

    this._renderDays();

    this._ui.body.dates.classList.add('is-active');
    this._ui.body.months.classList.remove('is-active');
    this._ui.body.years.classList.remove('is-active');
    this._ui.navigation.previous.removeAttribute('disabled');
    this._ui.navigation.next.removeAttribute('disabled');

    return this;
  }

  _refreshCalendarHeader() {
    this._ui.header.start.day.innerHTML = this._isValidDate(this.startDate) ? dateFns.getDate(this.startDate) : '&nbsp;';
    this._ui.header.start.weekday.innerHTML = this._isValidDate(this.startDate) ? dateFns.format(this.startDate, 'dddd', {
      locale: this.locale
    }) : '&nbsp;';
    this._ui.header.start.month.innerHTML = this._isValidDate(this.startDate) ? dateFns.format(this.startDate, 'MMMM YYYY', {
      locale: this.locale
    }) : '&nbsp;';

    if (this._ui.header.end) {
      this._ui.header.end.day.innerHTML = (this.options.isRange && this._isValidDate(this.endDate)) ? dateFns.getDate(this.endDate) : '&nbsp;';
      this._ui.header.end.weekday.innerHTML = (this.options.isRange && this._isValidDate(this.endDate)) ? dateFns.format(this.endDate, 'dddd', {
        locale: this.locale
      }) : '&nbsp;';
      this._ui.header.end.month.innerHTML = (this.options.isRange && this._isValidDate(this.endDate)) ? dateFns.format(this.endDate, 'MMMM YYYY', {
        locale: this.locale
      }) : '&nbsp;';
    }
  }

  /**
   * Recalculate calendar position
   * @method _adjustPosition
   * @return {void}
   */
  _adjustPosition() {
    //var width = this.elementCalendar.offsetWidth,
    // height = this.elementCalendar.offsetHeight,
    // viewportWidth = window.innerWidth || document.documentElement.clientWidth,
    // viewportHeight = window.innerHeight || document.documentElement.clientHeight,
    // scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
    let left, top, clientRect;

    if (typeof this.element.getBoundingClientRect === 'function') {
      clientRect = this.element.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else {
      left = this.element.offsetLeft;
      top = this.element.offsetTop + this.element.offsetHeight;
      while ((this.element = this.element.offsetParent)) {
        left += this.element.offsetLeft;
        top += this.element.offsetTop;
      }
    }

    this._ui.container.style.position = 'absolute';
    this._ui.container.style.left = left + 'px';
    this._ui.container.style.top = top + 'px';
  }

  _isValidDate(date, minDate, maxDate) {
    try {
      if (!date) {
        return false;
      }
      if (dateFns.isValid(date)) {
        if (!minDate && !maxDate) {
          return true;
        }
        if (minDate && maxDate) {
          return dateFns.isWithinRange(date, minDate, maxDate);
        }
        if (maxDate) {
          return dateFns.isBefore(date, maxDate) || dateFns.isEqual(date, maxDate);
        }
        return dateFns.isAfter(date, minDate) || dateFns.isEqual(date, minDate);
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  _snapshot() {
    this._snapshots.push({
      ...this._date
    });
  }
}