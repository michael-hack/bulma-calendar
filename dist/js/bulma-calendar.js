(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bulmaCalendar"] = factory();
	else
		root["bulmaCalendar"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_date__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_events__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__langs_langs__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__defaultOptions__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__template__ = __webpack_require__(6);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var onToggleDatePicker = Symbol('onToggleDatePicker');
var onCloseDatePicker = Symbol('onCloseDatePicker');
var onPreviousYearDatePicker = Symbol('onPreviousYearDatePicker');
var onNextYearDatePicker = Symbol('onNextYearDatePicker');
var onPreviousMonthDatePicker = Symbol('onPreviousMonthDatePicker');
var onNextMonthDatePicker = Symbol('onNextMonthDatePicker');
var onDateClickDatePicker = Symbol('onDateClickDatePicker');
var getDayNameDatePicker = Symbol('getDayNameDatePicker');

var _supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      _supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

var bulmaCalendar = function (_EventEmitter) {
  _inherits(bulmaCalendar, _EventEmitter);

  function bulmaCalendar(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, bulmaCalendar);

    var _this = _possibleConstructorReturn(this, (bulmaCalendar.__proto__ || Object.getPrototypeOf(bulmaCalendar)).call(this));

    _this.element = __WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](selector) ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!_this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    _this._clickEvents = ['click'];

    /// Set default options and merge with instance defined
    _this.options = _extends({}, __WEBPACK_IMPORTED_MODULE_4__defaultOptions__["a" /* default */], options);

    _this[onToggleDatePicker] = _this[onToggleDatePicker].bind(_this);
    _this[onCloseDatePicker] = _this[onCloseDatePicker].bind(_this);
    _this[onPreviousYearDatePicker] = _this[onPreviousYearDatePicker].bind(_this);
    _this[onNextYearDatePicker] = _this[onNextYearDatePicker].bind(_this);
    _this[onPreviousMonthDatePicker] = _this[onPreviousMonthDatePicker].bind(_this);
    _this[onNextMonthDatePicker] = _this[onNextMonthDatePicker].bind(_this);
    _this[onDateClickDatePicker] = _this[onDateClickDatePicker].bind(_this);
    _this[getDayNameDatePicker] = _this[getDayNameDatePicker].bind(_this);

    // Initiate plugin
    _this._init();
    return _this;
  }

  /**
   * Initiate all DOM element containing datePicker class
   * @method
   * @return {Array} Array of all datePicker instances
   */


  _createClass(bulmaCalendar, [{
    key: '_init',


    /**
     * Initiate plugin instance
     * @method _init
     * @return {datePicker} Current plugin instance
     */
    value: function _init() {
      this._id = 'datePicker' + new Date().getTime() + Math.floor(Math.random() * Math.floor(9999));
      this.dateFormat = this.options.dateFormat ? this.options.dateFormat : 'yyyy-mm-dd';
      this._lang = this.options.lang;
      this._open = false;

      this._initDates();
      this._build();
      this._bindEvents();

      this.emit('datepicker:ready', this._date);

      return this;
    }

    // Init dates used by datePicker core system

  }, {
    key: '_initDates',
    value: function _initDates() {
      // Set the startDate to the input value
      if (this.element.value) {
        this.date = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](this.element.value);
      } else {
        this.date = this.options.startDate ? this.options.dateFormat : new Date();
      }
      // Transform start date according to dateFormat option
      this.minDate = this.options.minDate ? this.options.minDate : '1970-01-01';
      this.maxDate = this.options.maxDate ? this.options.maxDate : '9999-12-31';

      if (this.options.disabledDates) {
        if (!Array.isArray(this.options.disabledDates)) {
          this.options.disabledDates = [this.options.disabledDates];
        }
        for (var i = 0; i < this.options.disabledDates.length; i++) {
          this.options.disabledDates[i] = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](__WEBPACK_IMPORTED_MODULE_0__utils_date__["c" /* getFormatedDate */](new Date(this.options.disabledDates[i]), this.dateFormat, __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.options.lang]));
        }
      }
    }

    /**
     * Build datePicker HTML component and append it to the DOM
     * @method _build
     * @return {datePicker} Current plugin instance
     */

  }, {
    key: '_build',
    value: function _build() {
      // Create datePicker HTML Fragment based on Template
      var datePickerFragment = document.createRange().createContextualFragment(Object(__WEBPACK_IMPORTED_MODULE_5__template__["a" /* default */])(_extends({}, this.options, {
        id: this.id,
        date: this.date,
        lang: __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang],
        getDayName: this[getDayNameDatePicker]
      })));

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

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      // Bind event to element in order to display/hide datePicker on click
      if (this.options.toggleOnInputClick === true) {
        this._clickEvents.forEach(function (clickEvent) {
          _this2.element.addEventListener(clickEvent, _this2[onToggleDatePicker]);
        });
      }

      if (this.options.overlay) {
        // Bind close event on Close button
        if (this.elementCloseButton) {
          this._clickEvents.forEach(function (clickEvent) {
            _this2.elementCloseButton.addEventListener(clickEvent, _this2[onCloseDatePicker]);
          });
        }
        // Bind close event on overlay based on options
        if (this.options.closeOnOverlayClick && this.elementOverlay) {
          this._clickEvents.forEach(function (clickEvent) {
            _this2.elementOverlay.addEventListener(clickEvent, _this2[onCloseDatePicker]);
          });
        }
      }

      // Bind year navigation events
      if (this.elementCalendarNavPreviousYear) {
        this._clickEvents.forEach(function (clickEvent) {
          _this2.elementCalendarNavPreviousYear.addEventListener(clickEvent, _this2[onPreviousYearDatePicker]);
        });
      }
      if (this.elementCalendarNavNextYear) {
        this._clickEvents.forEach(function (clickEvent) {
          _this2.elementCalendarNavNextYear.addEventListener(clickEvent, _this2[onNextYearDatePicker]);
        });
      }

      // Bind month navigation events
      if (this.elementCalendarNavPreviousMonth) {
        this._clickEvents.forEach(function (clickEvent) {
          _this2.elementCalendarNavPreviousMonth.addEventListener(clickEvent, _this2[onPreviousMonthDatePicker]);
        });
      }
      if (this.elementCalendarNavNextMonth) {
        this._clickEvents.forEach(function (clickEvent) {
          _this2.elementCalendarNavNextMonth.addEventListener(clickEvent, _this2[onNextMonthDatePicker]);
        });
      }
    }
  }, {
    key: onToggleDatePicker,
    value: function value(e) {
      e.preventDefault();

      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: onCloseDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      this.hide();
    }
  }, {
    key: onPreviousYearDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      this.prevYear();
    }
  }, {
    key: onNextYearDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      this.nextYear();
    }
  }, {
    key: onPreviousMonthDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      this.prevMonth();
    }
  }, {
    key: onNextMonthDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      this.nextMonth();
    }
  }, {
    key: onDateClickDatePicker,
    value: function value(e) {
      if (!_supportsPassive) {
        e.preventDefault();
      }
      if (!e.currentTarget.classList.contains('is-disabled')) {
        this.date = e.currentTarget.dataset.date;
        var _date = this.date,
            year = _date.year,
            month = _date.month,
            day = _date.day;


        this.emit('datepicker:date:selected', this);

        this.element.value = __WEBPACK_IMPORTED_MODULE_0__utils_date__["c" /* getFormatedDate */](new Date(year, month, day), this.dateFormat, __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang]);
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

  }, {
    key: '_bindDaysEvents',
    value: function _bindDaysEvents() {
      var _this3 = this;

      [].forEach.call(this.elementCalendarDays, function (calendarDay) {
        _this3._clickEvents.forEach(function (clickEvent) {
          calendarDay.addEventListener(clickEvent, _this3[onDateClickDatePicker]);
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

  }, {
    key: getDayNameDatePicker,
    value: function value(day) {
      var abbr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // will try to use weekStart from options if provided, also verify if it's in the range 0 ~ 6
      day += typeof this.options.weekStart != 'number' && this.options.weekStart >= 0 && this.options.weekStart <= 6 ? this.options.weekStart : __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang].weekStart;
      while (day >= 7) {
        day -= 7;
      }

      return abbr ? __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang].weekdaysShort[day] : __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang].weekdays[day];
    }
  }, {
    key: '_renderDay',
    value: function _renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut) {
      return '\n      <div data-date="' + (year + '-' + month + '-' + day) + '" class="calendar-date' + (isDisabled ? ' is-disabled' : '') + (isBetween ? ' calendar-range' : '') + (isSelectedIn ? ' calendar-range-start' : '') + (isSelectedOut ? ' calendar-range-end' : '') + '">\n        <button class="date-item' + (isToday ? ' is-today' : '') + (isSelected ? ' is-active' : '') + '">' + day + '</button>\n      </div>\n    ';
    }
  }, {
    key: '_renderDays',
    value: function _renderDays() {
      var now = new Date();
      var days = '';

      var numberOfDays = __WEBPACK_IMPORTED_MODULE_0__utils_date__["b" /* getDaysInMonth */](this.date.year, this.date.month),
          before = new Date(this.date.year, this.date.month, 1).getDay();

      this.emit('datepicker:rendered', this);

      // Get start day from options
      // will try to use weekStart from options if provided, also verify if it's in the range 0 ~ 6
      var startDay = typeof this.options.weekStart != 'number' && this.options.weekStart >= 0 && this.options.weekStart <= 6 ? this.options.weekStart : __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang].weekStart;
      if (startDay > 0) {
        before -= startDay;
        if (before < 0) {
          before += 7;
        }
      }

      var cells = numberOfDays + before,
          after = cells;
      while (after > 7) {
        after -= 7;
      }

      cells += 7 - after;
      for (var i = 0; i < cells; i++) {
        var day = new Date(this.date.year, this.date.month, 1 + (i - before)),
            isBetween = false,
            isSelected = __WEBPACK_IMPORTED_MODULE_0__utils_date__["a" /* compareDates */](day, this.options.startDate),
            isSelectedIn = false,
            isSelectedOut = false,
            isToday = __WEBPACK_IMPORTED_MODULE_0__utils_date__["a" /* compareDates */](day, now),
            isEmpty = i < before || i >= numberOfDays + before,
            isDisabled = false;

        day.setHours(0, 0, 0, 0);

        if (!isSelected) {
          isSelectedIn = false;
          isSelectedOut = false;
        }

        if (day.getMonth() !== this.date.month || this.minDate && day.getTime() < this.minDate.getTime() || this.maxDate && day.getTime() > this.maxDate.getTime()) {
          isDisabled = true;
        }

        if (this.options.disabledDates) {
          for (var j = 0; j < this.options.disabledDates.length; j++) {
            if (day.getTime() == this.options.disabledDates[j].getTime()) {
              isDisabled = true;
            }
          }
        }

        days += this._renderDay(day.getDate(), this.date.month, this.date.year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut);
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

  }, {
    key: 'prevMonth',
    value: function prevMonth() {
      this.date.month -= 1;
      this._refreshCalendar();
    }
  }, {
    key: '_disablePrevMonth',
    value: function _disablePrevMonth() {
      this.elementCalendarNavPreviousMonth.setAttribute('disabled', 'disabled');
    }
  }, {
    key: '_enablePrevMonth',
    value: function _enablePrevMonth() {
      this.elementCalendarNavPreviousMonth.removeAttribute('disabled');
    }

    /**
     * Navigate to the next month and regenerate calendar
     * @method nextMonth
     * @return {}
     */

  }, {
    key: 'nextMonth',
    value: function nextMonth() {
      this.date.month += 1;
      this._refreshCalendar();
    }
  }, {
    key: '_disableNextMonth',
    value: function _disableNextMonth() {
      this.elementCalendarNavNextMonth.setAttribute('disabled', 'disabled');
    }
  }, {
    key: '_enableNextMonth',
    value: function _enableNextMonth() {
      this.elementCalendarNavNextMonth.removeAttribute('disabled');
    }

    /**
     * Navigate to the previous year and regenerate calendar
     * @method prevYear
     * @return {void}
     */

  }, {
    key: 'prevYear',
    value: function prevYear() {
      this.date.year -= 1;
      this._refreshCalendar();
    }
  }, {
    key: '_disablePrevYear',
    value: function _disablePrevYear() {
      this.elementCalendarNavPreviousYear.setAttribute('disabled', 'disabled');
    }
  }, {
    key: '_enablePrevYear',
    value: function _enablePrevYear() {
      this.elementCalendarNavPreviousYear.removeAttribute('disabled');
    }

    /**
     * Navigate to the previous year and regenerate calendar
     * @method nextYear
     * @return {}
     */

  }, {
    key: 'nextYear',
    value: function nextYear() {
      this.date.year += 1;
      this._refreshCalendar();
    }
  }, {
    key: '_disableNextYear',
    value: function _disableNextYear() {
      this.elementCalendarNavNextYear.setAttribute('disabled', 'disabled');
    }
  }, {
    key: '_enableNextYear',
    value: function _enableNextYear() {
      this.elementCalendarNavNextYear.removeAttribute('disabled');
    }

    /**
     * Show datePicker HTML Component
     * @method show
     * @return {void}
     */

  }, {
    key: 'show',
    value: function show() {
      // Set the startDate to the input value
      if (this.element.value) {
        this.options.startDate = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](this.element.value);
      }
      // this.date.month = this.options.startDate.getMonth();
      // this.date.year = this.options.startDate.getFullYear();
      // this.date.day = this.options.startDate.getDate();
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

  }, {
    key: 'hide',
    value: function hide() {
      this._open = false;
      this.emit('datepicker:hide', this);
      this.elementContainer.classList.remove('is-active');
    }

    /**
     * Refresh calendar with new year/month days
     * @method _refreshCalendar
     * @return {[type]}        [description]
     */

  }, {
    key: '_refreshCalendar',
    value: function _refreshCalendar() {
      if (this.date.month < 0) {
        this.date.year -= Math.ceil(Math.abs(this.date.month) / 12);
        this.date.month += 12;
      }
      if (this.date.month > 11) {
        this.date.year += Math.floor(Math.abs(this.date.month) / 12);
        this.date.month -= 12;
      }
      this.elementCalendarNavMonth.innerHTML = __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang].months[this.date.month];
      this.elementCalendarNavYear.innerHTML = this.date.year;
      this.elementCalendarNavDay.innerHTML = this.date.day;
      this.elementCalendarBody.innerHTML = '';

      var minMonth = 0,
          minYear = 0,
          maxMonth = 12,
          maxYear = 9999;

      if (this.minDate) {
        minMonth = this.minDate.getMonth();
        minYear = this.minDate.getFullYear();
      }
      if (this.maxDate) {
        maxMonth = this.maxDate.getMonth();
        maxYear = this.maxDate.getFullYear();
      }

      if (this.date.year <= minYear) {
        this._disablePrevYear();
      } else {
        this._enablePrevYear();
      }

      if (this.date.year >= maxYear) {
        this._disableNextYear();
      } else {
        this._enableNextYear();
      }

      if (this.date.year <= minYear && this.date.month <= minMonth) {
        this._disablePrevMonth();
      } else {
        this._enablePrevMonth();
      }

      if (this.date.year >= maxYear && this.date.month >= maxMonth) {
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

  }, {
    key: '_adjustPosition',
    value: function _adjustPosition() {
      //var width = this.elementCalendar.offsetWidth,
      // height = this.elementCalendar.offsetHeight,
      // viewportWidth = window.innerWidth || document.documentElement.clientWidth,
      // viewportHeight = window.innerHeight || document.documentElement.clientHeight,
      // scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
      var left = void 0,
          top = void 0,
          clientRect = void 0;

      if (typeof this.element.getBoundingClientRect === 'function') {
        clientRect = this.element.getBoundingClientRect();
        left = clientRect.left + window.pageXOffset;
        top = clientRect.bottom + window.pageYOffset;
      } else {
        left = this.element.offsetLeft;
        top = this.element.offsetTop + this.element.offsetHeight;
        while (this.element = this.element.offsetParent) {
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

  }, {
    key: 'destroy',
    value: function destroy() {
      this.elementCalendar.remove();
    }
  }, {
    key: 'id',


    /**
     * Get id of current datePicker
     */
    get: function get() {
      return this._id;
    }

    // Get current datePicker language

  }, {
    key: 'lang',
    get: function get() {
      return this._lang;
    }

    // Set datePicker language
    ,
    set: function set() {
      var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';

      this._lang = typeof __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][lang] !== 'undefined' ? lang : 'en';
    }

    // Get date object

  }, {
    key: 'date',
    get: function get() {
      return this._date;
    }

    // Set startdate and init date by spliting it in {month, year, day}
    ,
    set: function set() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

      if (__WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](date)) {
        date = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](date, this.dateFormat);
      } else {
        date = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](__WEBPACK_IMPORTED_MODULE_0__utils_date__["c" /* getFormatedDate */](date, this.dateFormat, __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.lang]));
      }
      this._date = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      };
    }

    // Get minDate

  }, {
    key: 'minDate',
    get: function get() {
      return this._minDate;
    }

    // Set minDate (set to 1970-01-01 by default)
    ,
    set: function set() {
      var minDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1970-01-01';

      if (__WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](minDate)) {
        this._minDate = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](minDate, this.dateFormat);
      } else {
        this._minDate = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](__WEBPACK_IMPORTED_MODULE_0__utils_date__["c" /* getFormatedDate */](minDate, this._dateFormat, __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.options.lang]));
      }
    }

    // Get maxDate

  }, {
    key: 'maxDate',
    get: function get() {
      return this._maxDate;
    }

    // Set maxDate (set to 9999-12-31 by default)
    ,
    set: function set() {
      var maxDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '9999-12-31';

      if (__WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](maxDate)) {
        this._maxDate = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](maxDate, this.dateFormat);
      } else {
        this._maxDate = __WEBPACK_IMPORTED_MODULE_0__utils_date__["d" /* parseDate */](__WEBPACK_IMPORTED_MODULE_0__utils_date__["c" /* getFormatedDate */](maxDate, this._dateFormat, __WEBPACK_IMPORTED_MODULE_3__langs_langs__["a" /* default */][this.options.lang]));
      }
    }

    // Get dateFormat

  }, {
    key: 'dateFormat',
    get: function get() {
      return this._dateFormat;
    }

    // Set dateFormat (set to yyyy-mm-dd by default)
    ,
    set: function set() {
      var dateFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'yyyy-mm-dd';

      this._dateFormat = dateFormat;
      this._initDates();
      return this;
    }
  }], [{
    key: 'attach',
    value: function attach() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input[type="date"]';
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var datepickerInstances = new Array();

      var datepickers = __WEBPACK_IMPORTED_MODULE_1__utils_type__["a" /* isString */](selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
      [].forEach.call(datepickers, function (datepicker) {
        setTimeout(function () {
          datepickerInstances.push(new bulmaCalendar(datepicker, options));
        }, 100);
      });
      return datepickerInstances;
    }
  }]);

  return bulmaCalendar;
}(__WEBPACK_IMPORTED_MODULE_2__utils_events__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (bulmaCalendar);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getDaysInMonth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compareDates; });
/* unused harmony export isLeapYear */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return parseDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getFormatedDate; });
/**
 * Get the number of days in month
 * @method getDaysInMonth
 * @param  {Integer}       year  Year to check if we are facing a leapyear or not
 * @param  {Integer}       month Month for which we want to know the amount of days
 * @return {Integer}              Days amount
 */
var getDaysInMonth = function getDaysInMonth(year, month) {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

/**
 * Compare two dates
 * @method compareDates
 * @param  {Date}     a First date to compare
 * @param  {Date}     b Second Date to compare with
 * @return {Boolean}    True if dates are equal then false
 */
var compareDates = function compareDates(a, b) {
  // weak date comparison
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return a.getTime() === b.getTime();
};

/**
 * Check if given year is LeapYear or not
 * @method isLeapYear
 * @param  {Integer}   year Year to check
 * @return {Boolean}        True if LeapYear then False
 */
var isLeapYear = function isLeapYear(year) {
  // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};

/**
 * Parse Date string based on the Date Format given
 * @method parseDate
 * @param  {String}   dateString          Date string to parse
 * @param  {[String}   [format=undefined] Date Format
 * @return {Date}                         Date Object initialized with Date String based on the Date Format
 */
var parseDate = function parseDate(dateString) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var date = new Date();
  date.setHours(0, 0, 0, 0);

  var formatPattern = /((?:mm?)|(?:dd?)|(?:yyy?y?))[^0-9]((?:mm?)|(?:dd?)|(?:yyy?y?))[^0-9]((?:mm?)|(?:dd?)|(?:yyy?y?))/i;
  var datePattern = /(\d+)[^0-9](\d+)[^0-9](\d+)/i;

  var matchFormat = formatPattern.exec(format);
  if (matchFormat) {
    var matchDate = datePattern.exec(dateString);
    if (matchDate) {
      switch (matchFormat[1][0]) {
        case 'd':
          date.setDate(matchDate[1]);
          break;
        case 'm':
          date.setMonth(matchDate[1] - 1);
          break;
        case 'y':
          date.setFullYear(matchDate[1]);
          break;
      }

      switch (matchFormat[2][0]) {
        case 'd':
          date.setDate(matchDate[2]);
          break;
        case 'm':
          date.setMonth(matchDate[2] - 1);
          break;
        case 'y':
          date.setFullYear(matchDate[2]);
          break;
      }

      switch (matchFormat[3][0]) {
        case 'd':
          date.setDate(matchDate[3]);
          break;
        case 'm':
          date.setMonth(matchDate[3] - 1);
          break;
        case 'y':
          date.setFullYear(matchDate[3]);
          break;
      }
    }
  }

  return date;
};

/**
 * Returns date according to passed format
 * @method getFormatedDate
 * @param {Date}   dt     Date object
 * @param {String} format Format string
 *      d    - day of month
 *      dd   - 2-digits day of month
 *      D    - day of week
 *      m    - month number
 *      mm   - 2-digits month number
 *      M    - short month name
 *      MM   - full month name
 *      yy   - 2-digits year number
 *      yyyy - 4-digits year number
 */
var getFormatedDate = function getFormatedDate(dt, format, lang) {
  var items = {
    d: dt.getDate(),
    dd: dt.getDate(),
    D: dt.getDay(),
    m: dt.getMonth() + 1,
    mm: dt.getMonth() + 1,
    M: dt.getMonth(),
    MM: dt.getMonth(),
    yy: dt.getFullYear().toString().substr(-2),
    yyyy: dt.getFullYear()
  };

  items.dd < 10 && (items.dd = '0' + items.dd);
  items.mm < 10 && (items.mm = '0' + items.mm);
  items.D = lang.weekdays[items.D ? items.D - 1 : 6];
  items.M = lang.monthsShort[items.M];
  items.MM = lang.months[items.MM];

  return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function (m) {
    return typeof items[m] !== 'undefined' ? items[m] : m;
  });
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isString; });
/* unused harmony export isDate */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isString = function isString(unknown) {
  return typeof unknown === 'string' || !!unknown && (typeof unknown === 'undefined' ? 'undefined' : _typeof(unknown)) === 'object' && Object.prototype.toString.call(unknown) === '[object String]';
};
var isDate = function isDate(unknown) {
  return (Object.prototype.toString.call(unknown) === '[object Date]' || unknown instanceof Date) && !isNaN(unknown.valueOf());
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, EventEmitter);

    this._listeners = new Map(listeners);
    this._middlewares = new Map();
  }

  _createClass(EventEmitter, [{
    key: "listenerCount",
    value: function listenerCount(eventName) {
      if (!this._listeners.has(eventName)) {
        return 0;
      }

      var eventListeners = this._listeners.get(eventName);
      return eventListeners.length;
    }
  }, {
    key: "removeListeners",
    value: function removeListeners() {
      var _this = this;

      var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var middleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (eventName !== null) {
        if (Array.isArray(eventName)) {
          name.forEach(function (e) {
            return _this.removeListeners(e, middleware);
          });
        } else {
          this._listeners.delete(eventName);

          if (middleware) {
            this.removeMiddleware(eventName);
          }
        }
      } else {
        this._listeners = new Map();
      }
    }
  }, {
    key: "middleware",
    value: function middleware(eventName, fn) {
      var _this2 = this;

      if (Array.isArray(eventName)) {
        name.forEach(function (e) {
          return _this2.middleware(e, fn);
        });
      } else {
        if (!Array.isArray(this._middlewares.get(eventName))) {
          this._middlewares.set(eventName, []);
        }

        this._middlewares.get(eventName).push(fn);
      }
    }
  }, {
    key: "removeMiddleware",
    value: function removeMiddleware() {
      var _this3 = this;

      var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (eventName !== null) {
        if (Array.isArray(eventName)) {
          name.forEach(function (e) {
            return _this3.removeMiddleware(e);
          });
        } else {
          this._middlewares.delete(eventName);
        }
      } else {
        this._middlewares = new Map();
      }
    }
  }, {
    key: "on",
    value: function on(name, callback) {
      var _this4 = this;

      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Array.isArray(name)) {
        name.forEach(function (e) {
          return _this4.on(e, callback);
        });
      } else {
        name = name.toString();
        var split = name.split(/,|, | /);

        if (split.length > 1) {
          split.forEach(function (e) {
            return _this4.on(e, callback);
          });
        } else {
          if (!Array.isArray(this._listeners.get(name))) {
            this._listeners.set(name, []);
          }

          this._listeners.get(name).push({ once: once, callback: callback });
        }
      }
    }
  }, {
    key: "once",
    value: function once(name, callback) {
      this.on(name, callback, true);
    }
  }, {
    key: "emit",
    value: function emit(name, data) {
      var _this5 = this;

      var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      name = name.toString();
      var listeners = this._listeners.get(name);
      var middlewares = null;
      var doneCount = 0;
      var execute = silent;

      if (Array.isArray(listeners)) {
        listeners.forEach(function (listener, index) {
          // Start Middleware checks unless we're doing a silent emit
          if (!silent) {
            middlewares = _this5._middlewares.get(name);
            // Check and execute Middleware
            if (Array.isArray(middlewares)) {
              middlewares.forEach(function (middleware) {
                middleware(data, function () {
                  var newData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                  if (newData !== null) {
                    data = newData;
                  }
                  doneCount++;
                }, name);
              });

              if (doneCount >= middlewares.length) {
                execute = true;
              }
            } else {
              execute = true;
            }
          }

          // If Middleware checks have been passed, execute
          if (execute) {
            if (listener.once) {
              listeners[index] = null;
            }
            listener.callback(data);
          }
        });

        // Dirty way of removing used Events
        while (listeners.indexOf(null) !== -1) {
          listeners.splice(listeners.indexOf(null), 1);
        }
      }
    }
  }]);

  return EventEmitter;
}();

/* harmony default export */ __webpack_exports__["a"] = (EventEmitter);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var datepicker_langs = {
  ar: {
    weekStart: 0,
    previousMonth: 'الشهر الماضي',
    nextMonth: 'الشهر القادم',
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthsShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    weekdays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    weekdaysShort: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  },
  bn: {
    weekStart: 1,
    months: ['জানুয়ারী', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
    monthsShort: ['জানুয়ারী', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
    weekdays: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
    weekdaysShort: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  },
  de: {
    weekStart: 1,
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Febr', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  },
  en: {
    weekStart: 1,
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  es: {
    weekStart: 1,
    previousMonth: 'Mes anterior',
    nextMonth: 'Próximo mes',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
  },
  fa: {
    weekStart: 1,
    months: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
    monthsShort: ['ژان', 'فور', 'مار', 'آور', 'مه', 'ژون', 'ژوی', 'اوت', 'سپت', 'اکت', 'نوا', 'دسا'],
    weekdays: ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یک‌شنبه'],
    weekdaysShort: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه', 'یک']
  },
  fr: {
    weekStart: 1,
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Auo', 'Sep', 'Oct', 'Nov', 'Déc'],
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  },
  hi: {
    weekStart: 1,
    months: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवंबर', 'दिसम्बर'],
    monthsShort: ['जन', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितं', 'अक्टूबर', 'नवं', 'दिसम्बर'],
    weekdays: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
    weekdaysShort: ['सूर्य', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
  },
  hr: {
    weekStart: 2,
    previousMonth: 'Prošli mjesec',
    nextMonth: 'Slijedeći mjesec',
    months: ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'],
    monthsShort: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
    weekdays: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
    weekdaysShort: ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub']
  },
  hu: {
    weekStart: 1,
    previousMonth: 'Előző hónap',
    nextMonth: 'Következő hónap',
    months: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szept', 'Okt', 'Nov', 'Dec'],
    weekdays: ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
    weekdaysShort: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo']
  },
  id: {
    weekStart: 1,
    months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    weekdays: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    weekdaysShort: ['Mgu', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  },
  it: {
    weekStart: 1,
    previousMonth: 'Mese Precedente',
    nextMonth: 'Prossimo Mese',
    months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  },
  ja: {
    weekStart: 1,
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weekdays: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],
    weekdaysShort: ['日', '月', '火', '水', '木', '金', '土']
  },
  nl: {
    weekStart: 1,
    previousMonth: 'Vorige Maand',
    nextMonth: 'Volgende Maand',
    months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    monthsShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    weekdays: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
    weekdaysShort: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
  },
  pt: {
    weekStart: 1,
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  'pt-BR': {
    weekStart: 1,
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdays: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  ru: {
    weekStart: 1,
    previousMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  },
  sr: {
    weekStart: 2,
    previousMonth: 'Prošli mesec',
    nextMonth: 'Sledeći mesec',
    months: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
    weekdays: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
    weekdaysShort: ['ned', 'pon', 'uto', 'sre', 'čet', 'pet', 'sub']
  },
  th: {
    weekStart: 1,
    previousMonth: 'เดือนก่อนหน้า',
    nextMonth: 'เดือนถัดไป',
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    weekdays: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
    weekdaysShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
  },
  tr: {
    weekStart: 1,
    previousMonth: 'Önceki Ay',
    nextMonth: 'Gelecek Ay',
    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthsShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    weekdaysShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
  },
  'zh-cn': {
    weekStart: 1,
    previousMonth: '上个月',
    nextMonth: '下个月',
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  }
};

/* harmony default export */ __webpack_exports__["a"] = (datepicker_langs);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var defaultOptions = {
  startDate: new Date(),
  weekStart: null,
  minDate: null,
  maxDate: null,
  disabledDates: null,
  dateFormat: 'yyyy-mm-dd', // the default data format `field` value
  lang: 'en', // internationalization
  overlay: false,
  closeOnOverlayClick: true,
  closeOnSelect: true,
  toggleOnInputClick: true,
  icons: {
    month: {
      previous: '<svg viewBox="0 0 50 80" xml:space="preserve">\n        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>\n      </svg>',
      next: '<svg viewBox="0 0 50 80" xml:space="preserve">\n        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>\n      </svg>'
    },
    year: {
      previous: '<svg viewBox="0 0 50 80" xml:space="preserve">\n        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>\n      </svg>',
      next: '<svg viewBox="0 0 50 80" xml:space="preserve">\n        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>\n      </svg>'
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (defaultOptions);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function (data) {
  return '<div id=\'' + data.id + '\' class="datepicker ' + (data.overlay ? 'modal' : '') + '">\n    ' + (data.overlay ? '<div class="modal-background"></div>' : '') + '\n    <div class="calendar">\n      <div class="calendar-nav">\n        <div class="calendar-nav-month">\n          <button class="calendar-nav-previous-month button is-small is-text">' + data.icons.month.previous + '</button>\n          <div class="calendar-month">' + data.lang.months[data.date.month] + '</div>\n          <button class="calendar-nav-next-month button is-small is-text">' + data.icons.month.next + '</button>\n        </div>\n        <div class="calendar-nav-day">\n          <div class="calendar-day">' + data.date.day + '</div>\n        </div>\n        <div class="calendar-nav-year">\n          <button class="calendar-nav-previous-year button is-small is-text">' + data.icons.year.previous + '</button>\n          <div class="calendar-year">' + data.date.year + '</div>\n          <button class="calendar-nav-next-year button is-small is-text">' + data.icons.year.next + '</button>\n        </div>\n      </div>\n      <div class="calendar-container">\n        <div class="calendar-header">\n          <div class="calendar-date">' + data.getDayName(0, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(1, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(2, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(3, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(4, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(5, true) + '</div>\n          <div class="calendar-date">' + data.getDayName(6, true) + '</div>\n        </div>\n        <div class="calendar-body"></div>\n      </div>\n    </div>\n  </div>';
});

/***/ })
/******/ ])["default"];
});