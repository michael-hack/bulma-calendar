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
            ...options,
        };

        this._clickEvents     = ['click', 'touch'];
        this._supportsPassive = utils.detectSupportsPassive();
        this._id              = utils.uuid('datePicker');
        this.node             = null;

        this.onPreviousDatePicker    = this.onPreviousDatePicker.bind(this);
        this.onNextDatePicker        = this.onNextDatePicker.bind(this);
        this.onSelectMonthDatePicker = this.onSelectMonthDatePicker.bind(this);
        this.onMonthClickDatePicker  = this.onMonthClickDatePicker.bind(this);
        this.onSelectYearDatePicker  = this.onSelectYearDatePicker.bind(this);
        this.onYearClickDatePicker   = this.onYearClickDatePicker.bind(this);
        this.onDateClickDatePicker   = this.onDateClickDatePicker.bind(this);

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
        return (
            this._date || {
                start: undefined,
                end:   undefined,
            }
        );
    }

    // Set datePicker language
    set lang(lang) {
        try {
            this._locale = require(`date-fns/locale/${lang}/index.js`);
        } catch (e) {
            lang         = 'en-US';
            this._locale = require(`date-fns/locale/${lang}/index.js`);
        } finally {
            this._lang = lang;
            return this;
        }
    }

    // Get current datePicker language
    get lang() {
        return this._lang;
    }

    get locale() {
        return this._locale;
    }

    set start(date) {

        if (!date) {
            this._date.start = undefined;
            return this;
        }

        date = utils.newDate(date, this.format, 'yyyy-MM-dd');

        if (this._isValidDate(date, this.min, this.max)) {
            this._date.start = dateFns.startOfDay(date);
        }

        return this;

    }

    get start() {
        return this._date.start;
    }

    set end(date) {

        if (!date) {
            this._date.end = undefined;
            return this;
        }

        date = utils.newDate(date, this.format, 'yyyy-MM-dd');

        if (this._isValidDate(date, this.min, this.max)) {
            this._date.end = dateFns.endOfDay(date);
        }

        return this;

    }

    get end() {
        return this._date.end;
    }

    // Set min
    set min(date) {
        this._min = utils.newDate(date, this.format, 'yyyy-MM-dd');
        return this;
    }

    // Get min
    get min() {
        return this._min;
    }

    // Set max
    set max(date) {
        this._max = utils.newDate(date, this.format, 'yyyy-MM-dd');
        return this;
    }

    // Get max
    get max() {
        return this._max;
    }

    // Set date format (set to MM/dd/yyyy by default)
    set format(format) {
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
        const day       = Math.min(dateFns.getDaysInMonth(prevMonth), dateFns.getDate(this._visibleDate));

        this._setVisibleDate(dateFns.setDate(prevMonth, day));
        this.refresh();

    }

    onNextDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        const nextMonth   = dateFns.addMonths(this._visibleDate, 1);
        const day         = Math.min(dateFns.getDaysInMonth(nextMonth), dateFns.getDate(this._visibleDate));

        this._setVisibleDate(dateFns.setDate(nextMonth, day));
        this.refresh();

    }

    onSelectMonthDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        if (this.options.enableMonthSwitch) {
            this._ui.body.dates.classList.remove('is-active');
            this._ui.body.years.classList.remove('is-active');
            this._ui.body.months.classList.add('is-active');
            this._toggleNextButton(false);
            this._togglePreviousButton(false);
        }

    }

    onSelectYearDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        if (this.options.enableYearSwitch) {
            this._ui.body.dates.classList.remove('is-active');
            this._ui.body.months.classList.remove('is-active');
            this._ui.body.years.classList.add('is-active');
            this._toggleNextButton(false);
            this._togglePreviousButton(false);

            const currentYear = this._ui.body.years.querySelector('.calendar-year.is-active');
            if (currentYear) {
                this._ui.body.years.scrollTop = currentYear.offsetTop - this._ui.body.years.offsetTop - this._ui.body.years.clientHeight / 2;
            }
        }

    }

    onMonthClickDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        const newDate     = dateFns.setMonth(this._visibleDate, parseInt(e.currentTarget.dataset.month) - 1);
        this._visibleDate = this.min ? dateFns.max([newDate, this.min]) : newDate;
        this._visibleDate = this.max ? dateFns.min([this._visibleDate, this.max]) : this._visibleDate;

        this.refresh();

    }

    onYearClickDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        const newDate     = dateFns.setYear(this._visibleDate, parseInt(e.currentTarget.dataset.year));
        this._visibleDate = this.min ? dateFns.max([newDate, this.min]) : newDate;
        this._visibleDate = this.max ? dateFns.min([this._visibleDate, this.max]) : this._visibleDate;

        this.refresh();

    }

    onDateClickDatePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        if (!e.currentTarget.classList.contains('is-disabled')) {
            this._select(new Date(e.currentTarget.dataset.date));
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
        if (!Array.isArray(this.disabledDates)) return;
        const index = this.disabledDates.findIndex((disableDate) => dateFns.isEqual(disableDate, date));
        if (index > -1) {
            unset(this.disabledDates[index]);
        }
    }

    disableDate(date = undefined) {
        if (!Array.isArray(this.disabledDates)) return;
        const index = this.disabledDates.findIndex((disableDate) => dateFns.isEqual(disableDate, date));
        if (index === -1) {
            this.disabledDates.push(date);
        }
    }

    highlightDate(date = undefined) {
        if (!Array.isArray(this.highlightedDates)) return;
        const index = this.highlightedDates.findIndex((highlightDate) => dateFns.isEqual(highlightDate, date));
        if (index > -1) {
            unset(this.highlightedDates[index]);
        }
    }

    unhighlightDate(date = undefined) {
        if (!Array.isArray(this.highlightedDates)) return;
        const index = this.highlightedDates.findIndex((highlightDate) => dateFns.isEqual(highlightDate, date));
        if (index === -1) {
            this.highlightedDates.push(date);
        }
    }

    enableWeekDay(day) {
        const index = this.disabledWeekDays.findIndex((disabledWeekDay) => dateFns.isEqual(disabledWeekDay, day));
        if (index > -1) {
            unset(this.disabledWeekDays[index]);
        }
    }

    disableWeekDay(day) {
        const index = this.disabledWeekDays.findIndex((disabledWeekDay) => dateFns.isEqual(disabledWeekDay, day));
        if (index === -1) {
            this.disabledWeekDays.push(day);
        }
    }

    show() {

        if (this._open) return;

        this.refresh();
        this._ui.container.classList.add('is-active');

        this._open  = true;
        this._focus = true;

        this.emit('show', this);

    }

    hide() {

        if (!this._open) return;

        this._open  = false;
        this._focus = false;

        this._ui.container.classList.remove('is-active');

        this.emit('hide', this);

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

        // Set
        if (value) {

            if (this.options.isRange) {

                if (type.isString(value)) {
                    value = value.split(' - ');
                }

                if (Array.isArray(value)) {
                    if (value.length)       this.start = utils.newDate(value[0], this.format, 'yyyy-MM-dd');
                    if (value.length === 2) this.end   = utils.newDate(value[1], this.format, 'yyyy-MM-dd');
                }

            } else {
                this._select(value, false);
            }

            this.refresh();

            return;

        }

        // Get
        let string = this._isValidDate(this.start) ? dateFns.format(this.start, this.format, { locale: this.locale }) : '';

        if (this.options.isRange && this._isValidDate(this.end)) {
            string += ` - ${dateFns.format(this.end, this.format, { locale: this.locale })}`;
        }

        return string;

    }

    /**
     * Refresh datepicker with new year/month days
     * @method _refreshdatepicker
     * @return {[type]}        [description]
     */
    refresh() {

        this._ui.body.dates.innerHTML = '';

        // the 12 months of the year
        const monthLabels = new Array(12).fill(dateFns.startOfYear(this._visibleDate)).map((d, i) => dateFns.addMonths(d, i));

        this._ui.body.months.innerHTML = '';
        this._ui.body.months.appendChild(
            document.createRange().createContextualFragment(
                templateMonths({
                    months: monthLabels,
                    format: this.options.formats.selectMonth,
                    locale: this.locale,
                })
            )
        );

        const months = this._ui.body.months.querySelectorAll('.datepicker-month') || [];
        months.forEach((month) => {
            this._clickEvents.forEach((clickEvent) => {
                month.addEventListener(clickEvent, this.onMonthClickDatePicker);
            });
            month.classList.remove('is-active');
            if (month.dataset.month === dateFns.format(this._visibleDate, 'MM', { locale: this.locale })) {
                month.classList.add('is-active');
            }
        });

        // years
        const yearLabels = new Array(this.options.displayYearsCount * 2).fill(dateFns.subYears(this._visibleDate, this.options.displayYearsCount)).map((d, i) =>
            dateFns.addYears(d, i)
        );
        this._ui.body.years.innerHTML = '';
        this._ui.body.years.appendChild(
            document.createRange().createContextualFragment(
                templateYears({
                    visibleDate: this._visibleDate,
                    years:       yearLabels,
                    format:      this.options.formats.selectYear,
                    locale:      this.locale,
                })
            )
        );
        const years = this._ui.body.years.querySelectorAll('.datepicker-year') || [];
        years.forEach((year) => {
            this._clickEvents.forEach((clickEvent) => {
                year.addEventListener(clickEvent, this.onYearClickDatePicker);
            });
            year.classList.remove('is-active');
            if (year.dataset.year === dateFns.format(this._visibleDate, 'yyyy', { locale: this.locale })) {
                year.classList.add('is-active');
            }
        });

        // the 7 days of the week (Sun-Sat)
        const weekdayLabels = new Array(7).fill(dateFns.startOfWeek(this._visibleDate, {weekStartsOn: this.options.weekStart})).map((d, i) =>
            dateFns.addDays(d, i)
        );
        this._ui.body.dates.appendChild(
            document.createRange().createContextualFragment(
                templateWeekdays({
                    days:   weekdayLabels,
                    format: this.options.formats.weekday,
                    locale: this.locale,
                })
            )
        );

        if (this.min && dateFns.differenceInCalendarMonths(this._visibleDate, this.min) === 0) {
            this._togglePreviousButton(false);
        } else {
            this._togglePreviousButton();
        }

        if (this.max && dateFns.differenceInCalendarMonths(this._visibleDate, this.max) === 0) {
            this._toggleNextButton(false);
        } else {
            this._toggleNextButton();
        }

        this._ui.navigation.month.innerHTML = dateFns.format(this._visibleDate, this.options.formats.navigationMonth, {locale: this.locale});
        this._ui.navigation.year.innerHTML  = dateFns.format(this._visibleDate, this.options.formats.navigationYear, {locale: this.locale});

        this._renderDays();

        this._ui.body.dates.classList.add('is-active');
        this._ui.body.months.classList.remove('is-active');
        this._ui.body.years.classList.remove('is-active');

        return this;

    }

    clear() {

        const today = new Date();

        this._date = {
            start: undefined,
            end:   undefined,
        };

        this._setVisibleDate(today);
        this.refresh();

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

        this._open  = false;
        this.lang   = this.options.lang;
        this.format = this.options.dateFormat || 'MM/dd/yyyy';

        this.disabledDates    = type.isFunction(this.options.disabledDates) ? this.options.disabledDates : [];
        this.disabledWeekDays = type.isString(this.options.disabledWeekDays) ? this.options.disabledWeekDays.split(',') : Array.isArray(this.options.disabledWeekDays) ? this.options.disabledWeekDays : [];
        this.highlightedDates = type.isFunction(this.options.highlightedDates) ? this.options.highlightedDates : [];

        if (Array.isArray(this.options.disabledDates)) {
            for (let i = 0; i < this.options.disabledDates.length; i++) {
                this.disabledDates.push(utils.newDate(this.options.disabledDates[i], this.format, 'yyyy-MM-dd'));
            }
        }

        if (Array.isArray(this.options.highlightedDates)) {
            for (let i = 0; i < this.options.highlightedDates.length; i++) {
                this.highlightedDates.push(utils.newDate(this.options.highlightedDates[i], this.format, 'yyyy-MM-dd'));
            }
        }

        this.min = this.options.minDate;
        this.max = this.options.maxDate;
        this._date = {
            start: utils.newDate(this.options.startDate, this.format, 'yyyy-MM-dd'),
            end:   this.options.isRange ? utils.newDate(this.options.endDate, this.format, 'yyyy-MM-dd') : undefined,
        };

        // set visible date on start or today
        this._visibleDate = this._isValidDate(this.start) ? this.start : today;

        // check if visible date is in the valid min/max range and adjust if necessary
        if (!this._isValidDate(this._visibleDate, this.min, this.max)) {
            this._visibleDate = this.min ? this.min : this.max;
        }

        this._build();
        this._bindEvents();

        this.emit('ready', this);

    }

    _build() {
        this.node = document.createRange().createContextualFragment(
            template({
                locale:      this.locale,
                visibleDate: this._visibleDate,
                icons:       this.options.icons,
            })
        );

        this._ui = {
            container:  this.node.firstChild,
            navigation: {
                container: this.node.querySelector('.datepicker-nav'),
                previous:  this.node.querySelector('.datepicker-nav-previous'),
                next:      this.node.querySelector('.datepicker-nav-next'),
                month:     this.node.querySelector('.datepicker-nav-month'),
                year:      this.node.querySelector('.datepicker-nav-year'),
            },
            body:       {
                dates:    this.node.querySelector('.datepicker-dates'),
                days:     this.node.querySelector('.datepicker-days'),
                weekdays: this.node.querySelector('.datepicker-weekdays'),
                months:   this.node.querySelector('.datepicker-months'),
                years:    this.node.querySelector('.datepicker-years'),
            },
        };
    }

    _bindEvents() {

        document.addEventListener('keydown', (e) => {
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
            this._clickEvents.forEach((clickEvent) => {
                this._ui.navigation.previous.addEventListener(clickEvent, this.onPreviousDatePicker);
            });
        }
        if (this._ui.navigation.next) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.navigation.next.addEventListener(clickEvent, this.onNextDatePicker);
            });
        }
        if (this._ui.navigation.month) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.navigation.month.addEventListener(clickEvent, this.onSelectMonthDatePicker);
            });
        }
        if (this._ui.navigation.year) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.navigation.year.addEventListener(clickEvent, this.onSelectYearDatePicker);
            });
        }

        const months = this._ui.body.months.querySelectorAll('.calendar-month') || [];
        months.forEach((month) => {
            this._clickEvents.forEach((clickEvent) => {
                month.addEventListener(clickEvent, this.onMonthClickDatePicker);
            });
        });

        const years = this._ui.body.years.querySelectorAll('.calendar-year') || [];
        years.forEach((year) => {
            this._clickEvents.forEach((clickEvent) => {
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
            this._clickEvents.forEach((clickEvent) => {
                // if not in range, no click action
                // if in this month, select the date
                // if out of this month, jump to the date
                const onClick = !this._isValidDate(new Date(day.dataset.date), this.min, this.max) ? null : this.onDateClickDatePicker;
                day.addEventListener(clickEvent, onClick);
            });

            day.addEventListener('hover', (e) => {
                e.preventDEfault();
            });
        });
    }

    _renderDays() {

        const start = dateFns.startOfWeek(dateFns.startOfMonth(this._visibleDate), { weekStartsOn: this.options.weekStart }); // first day of current month view
        const end   = dateFns.endOfWeek(dateFns.endOfMonth(this._visibleDate), { weekStartsOn: this.options.weekStart }); // last day of current month view

        // get all days and whether they are within the current month and range
        const days = new Array(dateFns.differenceInDays(end, start) + 1).fill(start).map((s, i) => {

            const theDate     = dateFns.startOfDay(dateFns.addDays(s, i));
            const isThisMonth = dateFns.isSameMonth(this._visibleDate, theDate);
            const isInRange   = this.options.isRange && this.end && dateFns.isWithinInterval(theDate, { start: dateFns.startOfDay(this.start), end: dateFns.endOfDay(this.end) });
            let isDisabled    = this.max ? dateFns.isAfter(dateFns.startOfDay(theDate), dateFns.endOfDay(this.max)) : false;
            isDisabled        = !isDisabled && this.min ? dateFns.isBefore(dateFns.startOfDay(theDate), dateFns.startOfDay(this.min)) : isDisabled;
            let isHighlighted = false;

            // Disabled Dates
            if (Array.isArray(this.disabledDates)) {
                for (let j = 0; j < this.disabledDates.length; j++) {
                    if (theDate.toDateString() === this.disabledDates[j].toDateString()) {
                        isDisabled = true;
                    }
                }
            } else {
                if (type.isFunction(this.disabledDates)) {
                    if (this.disabledDates(this, theDate)) {
                        isDisabled = true;
                    }
                }
            }

            // Highlighted Dates
            if (Array.isArray(this.highlightedDates)) {
                for (let j = 0; j < this.highlightedDates.length; j++) {
                    if (theDate.toDateString() === this.highlightedDates[j].toDateString()) {
                        isHighlighted = true;
                    }
                }
            } else {
                if (type.isFunction(this.highlightedDates)) {
                    if (this.highlightedDates(this, theDate)) {
                        isHighlighted = true;
                    }
                }
            }

            // Disabled Weekdays
            if (this.disabledWeekDays) {
                this.disabledWeekDays.forEach((day) => {
                    if (dateFns.getDay(theDate) == day) {
                        isDisabled = true;
                    }
                });
            }

            return {
                date:          theDate,
                isRange:       this.options.isRange,
                isToday:       dateFns.isToday(theDate),
                isStartDate:   dateFns.isEqual(dateFns.startOfDay(this.start), theDate),
                isEndDate:     dateFns.isEqual(dateFns.startOfDay(this.end), theDate),
                isDisabled:    isDisabled,
                isThisMonth,
                isHighlighted: isHighlighted,
                isInRange,
            };

        });

        this._ui.body.dates.appendChild(document.createRange().createContextualFragment(templateDays(days)));
        this._ui.days = this._ui.body.dates.querySelectorAll('.datepicker-date');
        this._bindDaysEvents();

    }

    _select(date = undefined, emit = true) {

        if (!type.isDate(date)) {
            date = utils.newDate(date, this.format, 'yyyy-MM-dd');
        }

        if (this.options.isRange && (!this._isValidDate(this.start) || (this._isValidDate(this.start) && this._isValidDate(this.end)))) {
            this.start = date;
            this.end   = undefined;
            if (emit) this.emit('select:start', this);
        } else if (this.options.isRange && !this._isValidDate(this.end)) {
            if (dateFns.isBefore(date, this.start)) {
                this.end   = this.start;
                this.start = date;
                if (emit) this.emit('select', this);
            } else if (dateFns.isAfter(date, this.start)) {
                this.end = date;
                if (emit) this.emit('select', this);
            } else if (this.options.allowSameDayRange) {
                this.end = date;
                if (emit) this.emit('select', this);
            } else {
                this.start = date;
                this.end   = undefined;
                if (emit) this.emit('select:start', this);
            }
        } else {
            this.start = date;
            this.end   = undefined;
            if (emit) this.emit('select', this);
        }

        this._setVisibleDate(this.start);

        if (this.options.isRange && this._isValidDate(this.start) && this._isValidDate(this.end)) {
            new Array(dateFns.differenceInDays(this.end, this.start) + 1).fill(this.start).map((s, i) => {
                const theDate     = dateFns.addDays(s, i);
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
                    return dateFns.isWithinInterval(date, { start: min, end: max });
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

    _setVisibleDate(date) {

        if (!date) return;

        if (this.min) date = dateFns.max([date, this.min]);
        if (this.max) date = dateFns.min([date, this.max]);

        this._visibleDate = date;

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
