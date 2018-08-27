import * as utils from './utils/type';

import moment from 'moment';

import EventEmitter from './utils/events';
import defaultOptions from './defaultOptions';
import template from './template';

const onToggleDatePicker = Symbol('onToggleDatePicker');
const onCloseDatePicker = Symbol('onCloseDatePicker');
const onPreviousYearDatePicker = Symbol('onPreviousYearDatePicker');
const onNextYearDatePicker = Symbol('onNextYearDatePicker');
const onPreviousMonthDatePicker = Symbol('onPreviousMonthDatePicker');
const onNextMonthDatePicker = Symbol('onNextMonthDatePicker');
const onDateClickDatePicker = Symbol('onDateClickDatePicker');
const getDayNameDatePicker = Symbol('getDayNameDatePicker');

let _supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      _supportsPassive = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

export default class bulmaCalendar extends EventEmitter {
  constructor(selector, options = {}) {
    super();

    this.element = utils.isString(selector) ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    this._clickEvents = ['click'];

    /// Set default options and merge with instance defined
    this.options = {
      ...defaultOptions,
      ...options
    };

    this[onToggleDatePicker] = this[onToggleDatePicker].bind(this);
    this[onCloseDatePicker] = this[onCloseDatePicker].bind(this);
    this[onPreviousYearDatePicker] = this[onPreviousYearDatePicker].bind(this);
    this[onNextYearDatePicker] = this[onNextYearDatePicker].bind(this);
    this[onPreviousMonthDatePicker] = this[onPreviousMonthDatePicker].bind(this);
    this[onNextMonthDatePicker] = this[onNextMonthDatePicker].bind(this);
    this[onDateClickDatePicker] = this[onDateClickDatePicker].bind(this);
    this[getDayNameDatePicker] = this[getDayNameDatePicker].bind(this);

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

    const datepickers = utils.isString(selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
    [].forEach.call(datepickers, datepicker => {
      datepickerInstances.push(new bulmaCalendar(datepicker, options));
    });
    return datepickerInstances;
  }

  /**
   * Get id of current datePicker
   */
  get id() {
    return this._id;
  }

  // Get current datePicker language
  get lang() {
    return moment.locale();
  }

  // Set datePicker language
  set lang(lang = 'en') {
    moment.locale(lang);
  }

  // Get date object
  get date() {
    return this._date || moment();
  }

  set date(date = moment()) {
    this._date = moment(date).hours(0).minutes(0).seconds(0).milliseconds(0);
  }

  // Get minDate
  get minDate() {
    return this._minDate;
  }

  // Set minDate (set to 1970-01-01 by default)
  set minDate(minDate = null) {
    this._minDate = minDate ? moment(minDate, this.dateFormat) : null;
  }

  // Get maxDate
  get maxDate() {
    return this._maxDate;
  }

  // Set maxDate (set to 9999-12-31 by default)
  set maxDate(maxDate = null) {
    this._maxDate = maxDate ? moment(maxDate, this.dateFormat) : null;
  }

  // Get dateFormat
  get dateFormat() {
    return this._dateFormat;
  }

  // Set dateFormat (set to yyyy-mm-dd by default)
  set dateFormat(dateFormat) {
    this._dateFormat = dateFormat;
    this._initDates();
    return this;
  }

  /**
   * Initiate plugin instance
   * @method _init
   * @return {datePicker} Current plugin instance
   */
  _init() {
    this._id = 'datePicker' + (new Date()).getTime() + Math.floor(Math.random() * Math.floor(9999));
    this.lang = this.options.lang;
    this.dateFormat = this.options.dateFormat = this.options.dateFormat || this.element.dataset.dataFormat || moment.localeData().longDateFormat('L');
    this._open = false;
    
    this._build();
    this._bindEvents();

    this.emit('datepicker:ready', this._date);

    return this;
  }

  // Init dates used by datePicker core system
  _initDates() {
    // Set the selectedDate to the input value
    if (this.element.value) {
      if (this.element.getAttribute('type').toLowerCase() === 'date') {
        this.date = moment(this.element.value, 'YYYY-MM-DD');
      } else {
        this.date = moment(this.element.value);
      }
    } else {
      this.date = this.options.selectedDate ? moment(this.options.selectedDate) : moment();
    }
    // Transform start date according to dateFormat option
    this.minDate = this.options.minDate ? moment(this.options.minDate) : null;
    this.maxDate = this.options.maxDate ? moment(this.options.maxDate) : null;

    if (this.options.disabledDates) {
      if (!Array.isArray(this.options.disabledDates)) {
        this.options.disabledDates = [this.options.disabledDates];
      }
      for (var i=0; i < this.options.disabledDates.length; i++) {
        this.options.disabledDates[i] = moment(this.options.disabledDates[i]);
      }
    }
  }

  /**
   * Build datePicker HTML component and append it to the DOM
   * @method _build
   * @return {datePicker} Current plugin instance
   */
  _build() {
    // Create datePicker HTML Fragment based on Template
    const datePickerFragment = document.createRange().createContextualFragment(template({
      ...this.options,
      id: this.id,
      date: this.date,
      month: moment.months()[this.date.month()],
      getDayName: this[getDayNameDatePicker]
    }));

    // Save pointer to each datePicker element for later use
    this.elementContainer = datePickerFragment.querySelector('#' + this.id);
    this.elementCalendar = this.elementContainer.querySelector('.calendar');
    if (this.options.overlay) {
      this.elementOverlay = this.elementContainer.querySelector('.modal-background');
      this.elementCloseButton = this.elementContainer.querySelector('.modal-close');
    }
    this.elementCalendarNav = this.elementCalendar.querySelector('.calendar-nav');
    this.elementCalendarNavMonth = this.elementCalendar.querySelector('.calendar-month');
    this.elementCalendarNavYear = this.elementCalendar.querySelector('.calendar-year');
    this.elementCalendarNavDay = this.elementCalendar.querySelector('.calendar-day');
    this.elementCalendarNavPreviousMonth = this.elementCalendarNav.querySelector('.calendar-nav-previous-month');
    this.elementCalendarNavNextMonth = this.elementCalendarNav.querySelector('.calendar-nav-next-month');
    this.elementCalendarNavPreviousYear = this.elementCalendarNav.querySelector('.calendar-nav-previous-year');
    this.elementCalendarNavNextYear = this.elementCalendarNav.querySelector('.calendar-nav-next-year');
    this.elementCalendarHeader = this.elementCalendar.querySelector('.calendar-header');
    this.elementCalendarBody = this.elementCalendar.querySelector('.calendar-body');

    // Add datepicker HTML element to Document Body
    document.body.appendChild(datePickerFragment);
  }

  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    // Bind event to element in order to display/hide datePicker on click
    if(this.options.toggleOnInputClick === true){
      this._clickEvents.forEach(clickEvent => {
        this.element.addEventListener(clickEvent, this[onToggleDatePicker]);
      });
    }

    if (this.options.overlay) {
      // Bind close event on Close button
      if (this.elementCloseButton) {
        this._clickEvents.forEach(clickEvent => {
          this.elementCloseButton.addEventListener(clickEvent, this[onCloseDatePicker]);
        });
      }
      // Bind close event on overlay based on options
      if (this.options.closeOnOverlayClick && this.elementOverlay) {
        this._clickEvents.forEach(clickEvent => {
          this.elementOverlay.addEventListener(clickEvent, this[onCloseDatePicker]);
        });
      }
    }

    // Bind year navigation events
    if (this.elementCalendarNavPreviousYear) {
      this._clickEvents.forEach(clickEvent => {
        this.elementCalendarNavPreviousYear.addEventListener(clickEvent, this[onPreviousYearDatePicker]);
      });
    }
    if (this.elementCalendarNavNextYear) {
      this._clickEvents.forEach(clickEvent => {
        this.elementCalendarNavNextYear.addEventListener(clickEvent, this[onNextYearDatePicker]);
      });
    }

    // Bind month navigation events
    if (this.elementCalendarNavPreviousMonth) {
      this._clickEvents.forEach(clickEvent => {
        this.elementCalendarNavPreviousMonth.addEventListener(clickEvent, this[onPreviousMonthDatePicker]);
      });
    }
    if (this.elementCalendarNavNextMonth) {
      this._clickEvents.forEach(clickEvent => {
        this.elementCalendarNavNextMonth.addEventListener(clickEvent, this[onNextMonthDatePicker]);
      });
    }
  }

  [onToggleDatePicker](e) {
    e.preventDefault();

    if (this._open) {
      this.hide();
    } else {
      this.show();
    }
  }

  [onCloseDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    this.hide();
  }

  [onPreviousYearDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    this.prevYear();
  }

  [onNextYearDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    this.nextYear();
  }

  [onPreviousMonthDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    this.prevMonth();
  }

  [onNextMonthDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    this.nextMonth();
  }

  [onDateClickDatePicker](e) {
    if (!_supportsPassive) {
      e.preventDefault();
    }
    if (!e.currentTarget.classList.contains('is-disabled')) {
      this.date = moment(e.currentTarget.dataset.date, this.dateFormat);

      this.emit('datepicker:date:selected', this);

      if (this.element.getAttribute('type').toLowerCase() === 'date') {
        this.element.value = this.date.format('YYYY-MM-DD');
      } else {
        this.element.value = this.date.format(this.dateFormat);
      }
      if (this.options.closeOnSelect) {
        this.hide();
      }
    }
  }

  /**
   * Bind events on each Day item
   * @method _bindDaysEvents
   * @return {void}
   */
  _bindDaysEvents() {
    [].forEach.call(this.elementCalendarDays, (calendarDay) => {
      this._clickEvents.forEach(clickEvent => {
        calendarDay.addEventListener(clickEvent, this[onDateClickDatePicker]);
      });
    });
  }

  /**
   * Get localized day name
   * @method renderDayName
   * @param  {[type]}      day          [description]
   * @param  {Boolean}     [abbr=false] [description]
   * @return {[type]}                   [description]
   */
  [getDayNameDatePicker](day, abbr = false) {
    // will try to use weekStart from options if provided, also verify if it's in the range 0 ~ 6
    day += typeof this.options.weekStart == 'number' && this.options.weekStart >= 0 && this.options.weekStart <= 6 ? this.options.weekStart : this.lang.weekStart;
    while (day >= 7) {
      day -= 7;
    }

    return abbr ? moment.weekdaysShort()[day] : moment.weekdays()[day];
  }

  _renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut) {
    const date = moment({
      year: year,
      month: month,
      day: day
    }).format(this.dateFormat).toString();
    return `
      <div data-date="${`${date}`}" class="calendar-date${isDisabled ? ' is-disabled' : ''}${isBetween ? ' calendar-range' : ''}${isSelectedIn ? ' calendar-range-start' : ''}${isSelectedOut ? ' calendar-range-end' : ''}">
        <button class="date-item${isToday ? ' is-today' : ''}${isSelected ? ' is-active' : ''}">${day}</button>
      </div>
    `;
  }

  _renderDays() {
    const now = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
    let days = '';

    let numberOfDays = this.date.daysInMonth(),
      before = moment().year(this.date.year()).month(this.date.month()).date(1).day();


    // Get start day from options
    // will try to use weekStart from options if provided, also verify if it's in the range 0 ~ 6
    const startDay = typeof this.options.weekStart != 'number' && this.options.weekStart >= 0 && this.options.weekStart <= 6 ? this.options.weekStart : moment().startOf('week').day();
    if (startDay > 0) {
      before -= startDay;
      if (before < 0) {
        before += 7;
      }
    }

    let cells = numberOfDays + before,
      after = cells;
    while (after > 7) {
      after -= 7;
    }

    cells += 7 - after;
    for (var i = 0; i < cells; i++) {
      var day = moment().year(this.date.year()).month(this.date.month()).date(1 + (i - before)).hours(0).minutes(0).seconds(0).milliseconds(0),
        isBetween = false,
        isSelected = day.diff(this.date) == 0,
        isSelectedIn = false,
        isSelectedOut = false,
        isToday = day.diff(now) == 0,
        isEmpty = i < before || i >= (numberOfDays + before),
        isDisabled = false;

      if (!isSelected) {
        isSelectedIn = false;
        isSelectedOut = false;
      }

      if (day.month() !== this.date.month() || (this.minDate && day.unix() < this.minDate.unix()) || (this.maxDate && day.unix() > this.maxDate.unix())) {
        isDisabled = true;
      }

      if (this.options.disabledDates) {
        for (let j = 0; j < this.options.disabledDates.length; j++) {
          if (day.unix() == this.options.disabledDates[j].unix()) {
            isDisabled = true;
          }
        }
      }

      days += this._renderDay(day.date(),  day.month(), day.year(), isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut);


      this.emit('datepicker:rendered', this);
    }

    this.elementCalendarBody.insertAdjacentHTML('beforeend', days);
    this.elementCalendarDays = this.elementCalendarBody.querySelectorAll('.calendar-date');
    this._bindDaysEvents();
  }

  /**
   * Navigate to the previous month and regenerate calendar
   * @method prevMonth
   * @return {void}
   */
  prevMonth() {
    this.date.subtract(1, 'months');
    this._refreshCalendar();
  }

  _disablePrevMonth() {
    this.elementCalendarNavPreviousMonth.setAttribute('disabled', 'disabled');
  }

  _enablePrevMonth() {
    this.elementCalendarNavPreviousMonth.removeAttribute('disabled');
  }

  /**
   * Navigate to the next month and regenerate calendar
   * @method nextMonth
   * @return {}
   */
  nextMonth() {
    this.date.add(1, 'months');
    this._refreshCalendar();
  }

  _disableNextMonth() {
    this.elementCalendarNavNextMonth.setAttribute('disabled', 'disabled');
  }

  _enableNextMonth() {
    this.elementCalendarNavNextMonth.removeAttribute('disabled');
  }

  /**
   * Navigate to the previous year and regenerate calendar
   * @method prevYear
   * @return {void}
   */
  prevYear() {
    this.date.subtract(1, 'y');
    this._refreshCalendar();
  }

  _disablePrevYear() {
    this.elementCalendarNavPreviousYear.setAttribute('disabled', 'disabled');
  }

  _enablePrevYear() {
    this.elementCalendarNavPreviousYear.removeAttribute('disabled');
  }

  /**
   * Navigate to the previous year and regenerate calendar
   * @method nextYear
   * @return {}
   */
  nextYear() {
    this.date.add(1, 'y');
    this._refreshCalendar();
  }

  _disableNextYear() {
    this.elementCalendarNavNextYear.setAttribute('disabled', 'disabled');
  }

  _enableNextYear() {
    this.elementCalendarNavNextYear.removeAttribute('disabled');
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
   * Show datePicker HTML Component
   * @method show
   * @return {void}
   */
  show() {
    // Set the selectedDate to the input value
    if (this.element.value) {
      if (this.element.getAttribute('type').toLowerCase() === 'date') {
        this.date = moment(this.element.value, 'YYYY-MM-DD');
      } else {
        this.date = moment(this.element.value);
      }
    }

    this._refreshCalendar();

    this.emit('datepicker:show', this);

    this.elementContainer.classList.add('is-active');
    if (!this.options.overlay) {
      this._adjustPosition();
    }
    this._open = true;
  }

  /**
   * Hide datePicker HTML Component
   * @method hide
   * @return {void}
   */
  hide() {
    this._open = false;
    this.emit('datepicker:hide', this);
    this.elementContainer.classList.remove('is-active');
  }

  /**
   * Refresh calendar with new year/month days
   * @method _refreshCalendar
   * @return {[type]}        [description]
   */
  _refreshCalendar() {
    if (this.date.month < 0) {
      this.date.year -= Math.ceil(Math.abs(this.date.month()) / 12);
      this.date.month += 12;
    }
    if (this.date.month > 11) {
      this.date.year += Math.floor(Math.abs(this.date.month()) / 12);
      this.date.month -= 12;
    }
    this.elementCalendarNavMonth.innerHTML = moment.months()[this.date.month()];
    this.elementCalendarNavYear.innerHTML = this.date.year();
    this.elementCalendarNavDay.innerHTML = this.date.date();
    this.elementCalendarBody.innerHTML = '';

    let minMonth = 0,
      minYear = 0,
      maxMonth = 12,
      maxYear = 9999;

    if (this.minDate) {
      minMonth = this.minDate.month();
      minYear = this.minDate.year();
    }
    if (this.maxDate) {
      maxMonth = this.maxDate.month();
      maxYear = this.maxDate.year();
    }

    if (this.date.year() <= minYear) {
      this._disablePrevYear();
    } else {
      this._enablePrevYear();
    }

    if (this.date.year() >= maxYear) {
      this._disableNextYear();
    } else {
      this._enableNextYear();
    }

    if (this.date.year() <= minYear && this.date.month() <= minMonth) {
      this._disablePrevMonth();
    } else {
      this._enablePrevMonth();
    }

    if (this.date.year() >= maxYear && this.date.month() >= maxMonth) {
      this._disableNextMonth();
    } else {
      this._enableNextMonth();
    }

    this._renderDays();
    return this;
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

    this.elementCalendar.style.position = 'absolute';
    this.elementCalendar.style.left = left + 'px';
    this.elementCalendar.style.top = top + 'px';
  }

  /**
   * Destroy datePicker
   * @method destroy
   * @return {[type]} [description]
   */
  destroy() {
    this.elementCalendar.remove();
  }
}
