import * as utils from '../utils';
import * as type from '../utils/type';
import * as dateFns from 'date-fns';
import EventEmitter from '../utils/events';

import template from './templates/datepicker';
import templateDays from './templates/days';
import templateWeekdays from './templates/weekdays';
import templateMonths from './templates/months';
import templateYears from './templates/years';
import defaultOptions from './defaultOptions';

export default class datePicker extends EventEmitter {
	constructor(options = {}) {
		super();

		this.options = {
			...defaultOptions,
			...options
		};

		this._clickEvents = ['click', 'touch'];
		this._supportsPassive = utils.detectSupportsPassive();
		this._id = utils.uuid('datePicker');
		this.node = null;

		this.onPreviousDatePicker = this.onPreviousDatePicker.bind(this);
		this.onNextDatePicker = this.onNextDatePicker.bind(this);
		this.onSelectMonthDatePicker = this.onSelectMonthDatePicker.bind(this);
		this.onMonthClickDatePicker = this.onMonthClickDatePicker.bind(this);
		this.onSelectYearDatePicker = this.onSelectYearDatePicker.bind(this);
		this.onYearClickDatePicker = this.onYearClickDatePicker.bind(this);
		this.onDateClickDatePicker = this.onDateClickDatePicker.bind(this);

		this._init();
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

	set date(date) {
		if (type.isObject(date) && date.start && date.end) {
			this._date = date;
		}
		return this;
	}
	get date() {
		return this._date || {
			start: undefined,
			end: undefined
		}
	}

	// Set datePicker language
	set lang(lang = 'en') {
		this._lang = lang;
		this._locale = require('date-fns/locale/' + lang);
		return this;
	}
	// Get current datePicker language
	get lang() {
		return this._lang;
	}

	get locale() {
		return this._locale;
	}

	set start(date = undefined) {
		if (date) {
			if (type.isDate(date)) {
				this._date.start = this._isValidDate(date, this.min, this.max) ? dateFns.startOfDay(date) : this._date.start;
			}
			if (type.isString(date)) {
				this._date.start = this._isValidDate(dateFns.parse(date), this.min, this.max) ? dateFns.startOfDay(dateFns.parse(date)) : this._date.start;
			}
		} else {
			this._date.start = undefined
		}

		return this;
	}
	get start() {
		return this._date.start;
	}

	set end(date = undefined) {
		if (date) {
			if (type.isDate(date)) {
				this._date.end = this._isValidDate(date, this.min, this.max) ? dateFns.startOfDay(date) : this._date.end;
			}
			if (type.isString(date)) {
				this._date.end = this._isValidDate(dateFns.parse(date), this.min, this.max) ? dateFns.startOfDay(dateFns.parse(date)) : this._date.end;
			}
		} else {
			this._date.end = undefined
		}

		return this;
	}
	get end() {
		return this._date.end;
	}

	// Set min
	set min(date = undefined) {
		if (date) {
			if (type.isDate(date)) {
				this._min = this._isValidDate(date) ? dateFns.startOfDay(date) : this._min;
			}
			if (type.isString(date)) {
				this._min = this._isValidDate(dateFns.parse(date)) ? dateFns.startOfDay(date) : this._min;
			}
		}

		return this;
	}
	// Get min
	get min() {
		return this._min;
	}

	// Set max
	set max(date = null) {
		if (date) {
			if (type.isDate(date)) {
				this._max = this._isValidDate(date) ? dateFns.startOfDay(date) : this._max;
			}
			if (type.isString(date)) {
				this._max = this._isValidDate(dateFns.parse(date)) ? dateFns.startOfDay(date) : this._max;
			}
		}

		return this;
	}
	// Get max
	get max() {
		return this._max;
	}

	// Set date format (set to MM/DD/YYYY by default)
	set format(format = 'MM/DD/YYYY') {
		this._format = format;
		return this;
	}
	// Get date format
	get format() {
		return this._format;
	}

	/****************************************************
	 *                                                  *
	 * EVENTS FUNCTIONS                                 *
	 *                                                  *
	 ****************************************************/
	onPreviousDatePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		const prevMonth = dateFns.lastDayOfMonth(dateFns.subMonths(new Date(dateFns.getYear(this._visibleDate), dateFns.getMonth(this._visibleDate)), 1));
		const day = Math.min(dateFns.getDaysInMonth(prevMonth), dateFns.getDate(this._visibleDate));
		this._visibleDate = this.min ? dateFns.max(dateFns.setDate(prevMonth, day), this.min) : dateFns.setDate(prevMonth, day);

		this.refresh();
	}

	onNextDatePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		const nextMonth = dateFns.addMonths(this._visibleDate, 1);
		const day = Math.min(dateFns.getDaysInMonth(nextMonth), dateFns.getDate(this._visibleDate));
		this._visibleDate = this.max ? dateFns.min(dateFns.setDate(nextMonth, day), this.max) : dateFns.setDate(nextMonth, day);

		this.refresh();
	}

	onSelectMonthDatePicker(e) {
		e.stopPropagation();

		if (this.options.enableMonthSwitch) {
			this._ui.body.dates.classList.remove('is-active');
			this._ui.body.years.classList.remove('is-active');
			this._ui.body.months.classList.add('is-active');
			this._ui.navigation.previous.setAttribute('disabled', 'disabled');
			this._ui.navigation.next.setAttribute('disabled', 'disabled');
		}
	}

	onSelectYearDatePicker(e) {
		e.stopPropagation();

		if (this.options.enableYearSwitch) {
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
	}

	onMonthClickDatePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}

		e.stopPropagation();
		const newDate = dateFns.setMonth(this._visibleDate, parseInt(e.currentTarget.dataset.month) - 1);
		this._visibleDate = this.min ? dateFns.max(newDate, this.min) : newDate;
		this._visibleDate = this.max ? dateFns.min(this._visibleDate, this.max) : this._visibleDate;

		this.refresh();
	}

	onYearClickDatePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}

		e.stopPropagation();
		const newDate = dateFns.setYear(this._visibleDate, parseInt(e.currentTarget.dataset.year));
		this._visibleDate = this.min ? dateFns.max(newDate, this.min) : newDate;
		this._visibleDate = this.max ? dateFns.min(this._visibleDate, this.max) : this._visibleDate;

		this.refresh();
	}

	onDateClickDatePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		if (!e.currentTarget.classList.contains('is-disabled')) {
			this._select(e.currentTarget.dataset.date);

			this.refresh();
		}
	}

	/****************************************************
	 *                                                  *
	 * PUBLIC FUNCTIONS                                 *
	 *                                                  *
	 ****************************************************/
	isRange() {
		return this.options.isRange;
	}

	enableDate(date = undefined) {
		const index = this.disabledDates.findIndex(disableDate => dateFns.isEqual(disableDate, date));
		if (index > -1) {
			unset(this.disabledDates[index]);
		}
	}
	disableDate(date = undefined) {
		const index = this.disabledDates.findIndex(disableDate => dateFns.isEqual(disableDate, date));
		if (index > -1) {
			this.disabledDates.push(date);
		}
	}

	enableWeekDay(day) {
		const index = this.disabledWeekDays.findIndex(disabledWeekDay => dateFns.isEqual(disabledWeekDay, day));
		if (index > -1) {
			unset(this.disabledWeekDays[index]);
		}
	}
	disableWeekDay(day) {
		const index = this.disabledWeekDays.findIndex(disabledWeekDay => dateFns.isEqual(disabledWeekDay, date));
		if (index > -1) {
			this.disabledWeekDays.push(day);
		}
	}

	show() {
		if (!this._open) {
			this._ui.body.dates.classList.add('is-active');
			this._ui.body.months.classList.remove('is-active');
			this._ui.body.years.classList.remove('is-active');
			this._ui.navigation.previous.removeAttribute('disabled');
			this._ui.navigation.next.removeAttribute('disabled');
			this._ui.container.classList.add('is-active');
			this._open = true;
			this._focus = true;

			this.emit('show', this);
		}
	}

	hide() {
		if (this._open) {
			this._open = false;
			this._focus = false;
			this._ui.container.classList.remove('is-active');
			this.emit('hide', this);
		}
	}

	toggle() {
		if (!this._open) {
			this.show();
		} else {
			this.hide();
		}
	}

	/**
	 * Get / Set datePicker value
	 * @param {null|Date|Object|String} date optional if null then return the current date as String
	 */
	value(value = null) {
		if (value) {
			if (this.options.isRange) {
				if (type.isString(value)) {
					const dates = value.split(' - ');
					if (dates.length) {
						this.start = dateFns.format(new Date(dates[0]), this.format, {
							locale: this.locale
						});
					}
					if (dates.length === 2) {
						this.end = dateFns.format(new Date(dates[1]), this.format, {
							locale: this.locale
						});
					}
				}
				if (type.isObject(value) || type.isDate(value)) {
					this._select(value);
				}
			} else {
				this._select(value);
			}
		} else {
			let string = (this.start && this._isValidDate(this.start)) ? dateFns.format(this.start, this.format, {
				locale: this.locale
			}) : '';

			if (this.options.isRange) {
				if (this.end && this._isValidDate(this.end)) {
					string += ` - ${dateFns.format(this.end, this.format, { locale: this.locale })}`;
				}
			}
			return string;
		}
	}

	/**
	 * Refresh datepicker with new year/month days
	 * @method _refreshdatepicker
	 * @return {[type]}        [description]
	 */
	refresh() {
		this._ui.body.dates.innerHTML = '';

		// the 12 months of the year (Jan-SDecat)
		const monthLabels = new Array(12).fill(dateFns.startOfWeek(this._visibleDate)).map((d, i) => dateFns.format(dateFns.addMonths(d, i), 'MM', {
			locale: this.locale
		}));
		this._ui.body.months.innerHTML = '';
		this._ui.body.months.appendChild(document.createRange().createContextualFragment(templateMonths({
			months: monthLabels
		})));
		const months = this._ui.body.months.querySelectorAll('.datepicker-month') || [];
		months.forEach(month => {
			this._clickEvents.forEach(clickEvent => {
				month.addEventListener(clickEvent, this.onMonthClickDatePicker);
			});
			month.classList.remove('is-active');
			if (month.dataset.month === dateFns.format(this._visibleDate, 'MM', {
					locale: this.locale
				})) {
				month.classList.add('is-active');
			}
		});

		const yearLabels = new Array(100).fill(dateFns.subYears(this._visibleDate, 50)).map((d, i) => dateFns.format(dateFns.addYears(d, i), 'YYYY', {
			locale: this.locale
		}));
		this._ui.body.years.innerHTML = '';
		this._ui.body.years.appendChild(document.createRange().createContextualFragment(templateYears({
			visibleDate: this._visibleDate,
			years: yearLabels
		})));
		const years = this._ui.body.years.querySelectorAll('.datepicker-year') || [];
		years.forEach(year => {
			this._clickEvents.forEach(clickEvent => {
				year.addEventListener(clickEvent, this.onYearClickDatePicker);
			});
			year.classList.remove('is-active');
			if (year.dataset.year === dateFns.format(this._visibleDate, 'YYYY', {
					locale: this.locale
				})) {
				year.classList.add('is-active');
			}
		});

		// the 7 days of the week (Sun-Sat)
		const weekdayLabels = new Array(7).fill(dateFns.startOfWeek(this._visibleDate)).map((d, i) => dateFns.format(dateFns.addDays(d, i + this.options.weekStart), 'ddd', {
			locale: this.locale
		}));
		this._ui.body.dates.appendChild(document.createRange().createContextualFragment(templateWeekdays({
			weekdays: weekdayLabels
		})));


		if (this.min && dateFns.differenceInMonths(this._visibleDate, this.min) === 0) {
			this._togglePreviousButton(false);
		} else {
			this._togglePreviousButton();
		}

		if (this.max && dateFns.differenceInMonths(this._visibleDate, this.max) === 0) {
			this._toggleNextButton(false);
		} else {
			this._toggleNextButton();
		}

		this._ui.navigation.month.innerHTML = dateFns.format(this._visibleDate, 'MMMM', {
			locale: this.locale
		});
		this._ui.navigation.year.innerHTML = dateFns.format(this._visibleDate, 'YYYY', {
			locale: this.locale
		});

		this._renderDays();

		this._ui.body.dates.classList.add('is-active');
		this._ui.body.months.classList.remove('is-active');
		this._ui.body.years.classList.remove('is-active');
		this._ui.navigation.previous.removeAttribute('disabled');
		this._ui.navigation.next.removeAttribute('disabled');

		return this;
	}

	clear() {
		const today = new Date();
		this._date = {
			start: undefined,
			end: undefined
		};
		this._visibleDate = this._isValidDate(today, this.min, this.max) ? today : this.min;
		this.refresh();
	}

	snapshot() {
		this._snapshots.push({
			...this._date
		});
	}

	render() {
		this.refresh();
		return this.node;
	}

	/****************************************************
	 *                                                  *
	 * PRIVATE FUNCTIONS                                *
	 *                                                  *
	 ****************************************************/
	_init() {
		const today = new Date();

		this._open = false;
		this._snapshots = [];
		this.lang = this.options.lang;
		this.format = this.options.dateFormat || 'MM/DD/YYYY';
		this.disabledDates = Array.isArray(this.options.disabledDates) ? this.options.disabledDates : [];
		for (var i = 0; i < this.disabledDates.length; i++) {
			this.disabledDates[i] = dateFns.format(this.disabledDates[i], this.format, {
				locale: this.locale
			});
		}
		this.disabledWeekDays = type.isString(this.options.disabledWeekDays) ? this.options.disabledWeekDays.split(',') : (Array.isArray(this.options.disabledWeekDays) ? this.options.disabledWeekDays : []);
		this.min = this.options.minDate;
		this.max = this.options.maxDate;
		this._date = {
			start: this.options.startDate,
			end: this.options.isRange ? this.options.endDate : undefined
		};
		this._visibleDate = this._isValidDate(this.start) ? this.start : (this._isValidDate(today, this.min, this.max) ? today : this.min);

		this._build();
		this._bindEvents();

		this.emit('ready', this);
	}

	_build() {
		this.node = document.createRange().createContextualFragment(template({
			locale: this.locale,
			visibleDate: this._visibleDate,
			icons: this.options.icons
		}));

		this._ui = {
			container: this.node.firstChild,
			navigation: {
				container: this.node.querySelector('.datepicker-nav'),
				previous: this.node.querySelector('.datepicker-nav-previous'),
				next: this.node.querySelector('.datepicker-nav-next'),
				month: this.node.querySelector('.datepicker-nav-month'),
				year: this.node.querySelector('.datepicker-nav-year')
			},
			body: {
				dates: this.node.querySelector('.datepicker-dates'),
				days: this.node.querySelector('.datepicker-days'),
				weekdays: this.node.querySelector('.datepicker-weekdays'),
				months: this.node.querySelector('.datepicker-months'),
				years: this.node.querySelector('.datepicker-years')
			}
		};
	}

	_bindEvents() {
		document.addEventListener('keydown', e => {
			if (this._focus) {
				switch (e.keyCode || e.which) {
					case 37:
						this.onPreviousDatePicker(e);
						break;
					case 39:
						this.onNextDatePicker(e);
						break;
				}
			}
		});

		// Bind year navigation events
		if (this._ui.navigation.previous) {
			this._clickEvents.forEach(clickEvent => {
				this._ui.navigation.previous.addEventListener(clickEvent, this.onPreviousDatePicker);
			});
		}
		if (this._ui.navigation.next) {
			this._clickEvents.forEach(clickEvent => {
				this._ui.navigation.next.addEventListener(clickEvent, this.onNextDatePicker);
			});
		}

		if (this._ui.navigation.month) {
			this._clickEvents.forEach(clickEvent => {
				this._ui.navigation.month.addEventListener(clickEvent, this.onSelectMonthDatePicker);
			});
		}
		if (this._ui.navigation.year) {
			this._clickEvents.forEach(clickEvent => {
				this._ui.navigation.year.addEventListener(clickEvent, this.onSelectYearDatePicker);
			});
		}

		const months = this._ui.body.months.querySelectorAll('.calendar-month') || [];
		months.forEach(month => {
			this._clickEvents.forEach(clickEvent => {
				month.addEventListener(clickEvent, this.onMonthClickDatePicker);
			});
		});

		const years = this._ui.body.years.querySelectorAll('.calendar-year') || [];
		years.forEach(year => {
			this._clickEvents.forEach(clickEvent => {
				year.addEventListener(clickEvent, this.onYearClickDatePicker);
			});
		});
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
				const onClick = !this._isValidDate(new Date(day.dataset.date), this.min, this.max) ? null : this.onDateClickDatePicker;
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
				const theDate = dateFns.startOfDay(dateFns.addDays(s, i + this.options.weekStart));
				const isThisMonth = dateFns.isSameMonth(this._visibleDate, theDate);
				const isInRange = this.options.isRange && dateFns.isWithinRange(theDate, dateFns.startOfDay(this.start), dateFns.endOfDay(this.end));
				let isDisabled = this.max ? dateFns.isAfter(dateFns.startOfDay(theDate), dateFns.endOfDay(this.max)) : false;
				isDisabled = !isDisabled && this.min ? dateFns.isBefore(dateFns.startOfDay(theDate), dateFns.startOfDay(this.min)) : isDisabled;

				if (this.disabledDates) {
					for (let j = 0; j < this.disabledDates.length; j++) {
						let day = this.disabledDates[j];
						if (type.isFunction(day)) {
							day = day(this);
						}
						if (dateFns.getTime(theDate) == dateFns.getTime(day)) {
							isDisabled = true;
						}
					}
				}

				if (this.disabledWeekDays) {
					this.disabledWeekDays.forEach(day => {
						if (type.isFunction(day)) {
							day = day(this);
						}
						if (dateFns.getDay(theDate) == day) {
							isDisabled = true;
						}
					});
				}

				return {
					date: theDate,
					isRange: this.options.isRange,
					isToday: dateFns.isToday(theDate),
					isStartDate: dateFns.isEqual(dateFns.startOfDay(this.start), theDate),
					isEndDate: dateFns.isEqual(dateFns.startOfDay(this.end), theDate),
					isDisabled: isDisabled,
					isThisMonth,
					isInRange
				};
			});

		this._ui.body.dates.appendChild(document.createRange().createContextualFragment(templateDays(days)));
		this._ui.days = this._ui.body.dates.querySelectorAll('.datepicker-date');
		this._bindDaysEvents();
	}

	_select(date = undefined) {
		this.snapshot();
		date = type.isDate(date) ? date : new Date(date);
		if (this.options.isRange && (!this._isValidDate(this.start) || (this._isValidDate(this.start) && this._isValidDate(this.end)))) {
			this.start = date;
			this.end = undefined;
			this.emit('select:start', this);
		} else if (this.options.isRange && !this._isValidDate(this.end)) {
			if (dateFns.isBefore(date, this.start)) {
				this.end = this.start;
				this.start = date;
				this.emit('select', this);
			} else if (dateFns.isAfter(date, this.start)) {
				this.end = date;
				this.emit('select', this);
			} else if (this.options.allowSameDayRange) {
				this.end = date;
				this.emit('select', this);
			} else {
				this.start = date;
				this.end = undefined;
				this.emit('select:start', this);
			}
		} else {
			this.start = date;
			this.end = undefined;
			this.emit('select', this);
		}
		this._visibleDate = this._isValidDate(this.start) ? this.start : this._visibleDate;

		if (this.options.isRange && this._isValidDate(this.start) && this._isValidDate(this.end)) {
			new Array(dateFns.differenceInDays(this.end, this.start) + 1)
				.fill(this.start)
				.map((s, i) => {
					const theDate = dateFns.addDays(s, i);
					const dateElement = this._ui.body.dates.querySelector(`.datepicker-date[data-date="${theDate.toString()}"]`);
					if (dateElement) {
						if (dateFns.isEqual(this.start, theDate)) {
							dateElement.classList.add('datepicker-range-start');
						}
						if (dateFns.isEqual(this.end, theDate)) {
							dateElement.classList.add('datepicker-range-end');
						}
						dateElement.classList.add('datepicker-range');
					}
				});
		}
	}

	_isValidDate(date, min, max) {
		try {
			if (!date) {
				return false;
			}
			if (dateFns.isValid(date)) {
				if (!min && !max) {
					return true;
				}
				if (min && max) {
					return dateFns.isWithinRange(date, min, max);
				}
				if (max) {
					return dateFns.isBefore(date, max) || dateFns.isEqual(date, max);
				}
				return dateFns.isAfter(date, min) || dateFns.isEqual(date, min);
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
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
}
