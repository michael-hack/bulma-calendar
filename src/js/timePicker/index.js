import * as utils from '../utils';
import * as type from '../utils/type';
import * as dateFns from 'date-fns';
import EventEmitter from '../utils/events';

import template from './templates/timepicker';
import defaultOptions from './defaultOptions';

export default class timePicker extends EventEmitter {
	constructor(options = {}) {
		super();

		this.options = {
			...defaultOptions,
			...options
		};

		this._clickEvents = ['click', 'touch'];
		this._supportsPassive = utils.detectSupportsPassive();
		this._id = utils.uuid('timePicker');
		this.node = null;

		this.onPreviousHourStartTimePicker = this.onPreviousHourStartTimePicker.bind(this);
		this.onNextHourStartTimePicker = this.onNextHourStartTimePicker.bind(this);
		this.onPreviousMinuteStartTimePicker = this.onPreviousMinuteStartTimePicker.bind(this);
		this.onNextMinuteStartTimePicker = this.onNextMinuteStartTimePicker.bind(this);
		this.onPreviousHourEndTimePicker = this.onPreviousHourEndTimePicker.bind(this);
		this.onNextHourEndTimePicker = this.onNextHourEndTimePicker.bind(this);
		this.onPreviousMinuteEndTimePicker = this.onPreviousMinuteEndTimePicker.bind(this);
		this.onNextMinuteEndTimePicker = this.onNextMinuteEndTimePicker.bind(this);

		this._init();
	}

	/****************************************************
	 *                                                  *
	 * PRIVATE FUNCTIONS                                *
	 *                                                  *
	 ****************************************************/
	_init() {
		this._open = false;
		this._snapshots = [];
		this.lang = this.options.lang;
		this.format = this.options.format || 'HH:mm';
		this.min = this.options.min;
		this.max = this.options.max;
		this._time = {
			start: dateFns.startOfToday(),
			end: dateFns.endOfToday()
		};
		this.start = this.options.start || dateFns.startOfToday();
		this.end = this.options.isRange ? this.options.end : dateFns.endOfToday();

		this._build();
		this._bindEvents();

		this.emit('ready', this);
	}

	_build() {
		this.node = document.createRange().createContextualFragment(template({
			locale: this.locale,
			isRange: this.options.isRange,
			icons: this.options.icons
		}));

		this._ui = {
			container: this.node.firstChild,
			start: {
				container: this.node.querySelector('.timepicker-start'),
				hours: {
					container: this.node.querySelector('.timepicker-start .timepicker-hours'),
					input: this.node.querySelector('.timepicker-start .timepicker-hours input'),
					number: this.node.querySelector('.timepicker-start .timepicker-hours .timepicker-input-number'),
					previous: this.node.querySelector('.timepicker-start .timepicker-hours .timepicker-previous'),
					next: this.node.querySelector('.timepicker-start .timepicker-hours .timepicker-next')
				},
				minutes: {
					container: this.node.querySelector('.timepicker-start .timepicker-minutes'),
					input: this.node.querySelector('.timepicker-start .timepicker-minutes input'),
					number: this.node.querySelector('.timepicker-start .timepicker-minutes .timepicker-input-number'),
					previous: this.node.querySelector('.timepicker-start .timepicker-minutes .timepicker-previous'),
					next: this.node.querySelector('.timepicker-start .timepicker-minutes .timepicker-next')
				}
			},
			end: {
				container: this.node.querySelector('.timepicker-end'),
				hours: {
					container: this.node.querySelector('.timepicker-end .timepicker-hours'),
					input: this.node.querySelector('.timepicker-end .timepicker-hours input'),
					number: this.node.querySelector('.timepicker-end .timepicker-hours .timepicker-input-number'),
					previous: this.node.querySelector('.timepicker-end .timepicker-hours .timepicker-previous'),
					next: this.node.querySelector('.timepicker-end .timepicker-hours .timepicker-next')
				},
				minutes: {
					container: this.node.querySelector('.timepicker-end .timepicker-minutes'),
					input: this.node.querySelector('.timepicker-end .timepicker-minutes input'),
					number: this.node.querySelector('.timepicker-end .timepicker-minutes .timepicker-input-number'),
					previous: this.node.querySelector('.timepicker-end .timepicker-minutes .timepicker-previous'),
					next: this.node.querySelector('.timepicker-end .timepicker-minutes .timepicker-next')
				}
			}
		};
	}

	_bindEvents() {
		this._clickEvents.forEach(clickEvent => {
			this._ui.start.hours.previous.addEventListener(clickEvent, this.onPreviousHourStartTimePicker);
			this._ui.start.hours.next.addEventListener(clickEvent, this.onNextHourStartTimePicker);
			this._ui.start.minutes.previous.addEventListener(clickEvent, this.onPreviousMinuteStartTimePicker);
			this._ui.start.minutes.next.addEventListener(clickEvent, this.onNextMinuteStartTimePicker);

			if (this.options.isRange) {
				this._ui.end.hours.previous.addEventListener(clickEvent, this.onPreviousHourEndTimePicker);
				this._ui.end.hours.next.addEventListener(clickEvent, this.onNextHourEndTimePicker);
				this._ui.end.minutes.previous.addEventListener(clickEvent, this.onPreviousMinuteEndTimePicker);
				this._ui.end.minutes.next.addEventListener(clickEvent, this.onNextMinuteEndTimePicker);
			}
		});
	}

	_select(time = undefined) {
		this.snapshot();
		time = type.isDate(time) ? time : new Date(time);
		if (this.options.isRange && (!this._isValidTime(this.start) || (this._isValidTime(this.start) && this._isValidTime(this.end)))) {
			this.start = time;
			this.end = dateFns.endOfToday();
			this.emit('select:start', this);
		} else if (this.options.isRange && !this._isValidTime(this.end)) {
			if (dateFns.isBefore(time, this.start)) {
				this.end = this.start;
				this.start = dateFns.endOfToday();
				this.emit('select', this);
			} else if (dateFns.isAfter(time, this.start)) {
				this.end = time;
				this.emit('select', this);
			} else {
				this.start = time;
				this.end = dateFns.endOfToday();
				this.emit('select:start', this);
			}
		} else {
			this.start = time;
			this.end = dateFns.endOfToday();
			this.emit('select', this);
		}
	}

	_isValidTime(time, min, max) {
		try {
			if (!time) {
				return false;
			}
			if (dateFns.isValid(time)) {
				if (!min && !max) {
					return true;
				}
				if (min && max) {
					return dateFns.isWithinRange(time, min, max);
				}
				if (max) {
					return dateFns.isBefore(time, max) || dateFns.isEqual(time, max);
				}
				return dateFns.isAfter(time, min) || dateFns.isEqual(time, min);
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}

	/****************************************************
	 *                                                  *
	 * GETTERS and SETTERS                              *
	 *                                                  *
	 ****************************************************/
	/**
	 * Get id of current TimePicker
	 */
	get id() {
		return this._id;
	}

	set time(time) {
		if (type.isObject(time) && time.start && time.end) {
			this._time = time;
		}
		return this;
	}
	get time() {
		return this._time || {
			start: undefined,
			end: undefined
		}
	}

	// Set TimePicker language
	set lang(lang = 'en') {
		this._lang = lang;
		this._locale = require('date-fns/locale/' + lang);
		return this;
	}
	// Get current TimePicker language
	get lang() {
		return this._lang;
	}

	get locale() {
		return this._locale;
	}

	set start(time) {
		this._time.start = time ? (this._isValidTime(time, this.min, this.max) ? time : this._time.start) : dateFns.startOfToday();
		return this;
	}
	get start() {
		return this._time.start;
	}

	set end(time) {
		this._time.end = time ? (this._isValidTime(time, this.min, this.max) ? time : this._time.end) : dateFns.endOfToday();
		return this;
	}
	get end() {
		return this._time.end;
	}

	// Set min
	set min(time = undefined) {
		this._min = time ? (this._isValidTime(time) ? time : this._min) : undefined;
		return this;
	}
	// Get min
	get min() {
		return this._min;
	}

	// Set max
	set max(time = null) {
		this._max = time ? (this._isValidTime(time) ? time : this._max) : undefined;
		return this;
	}
	// Get max
	get max() {
		return this._max;
	}

	// Set time format (set to HH:mm by default)
	set format(format = 'HH:mm') {
		this._format = format;
		return this;
	}
	// Get time format
	get format() {
		return this._format;
	}

	/****************************************************
	 *                                                  *
	 * EVENTS FUNCTIONS                                 *
	 *                                                  *
	 ****************************************************/
	onPreviousHourStartTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.start = dateFns.subHours(this.start, 1);
		setTimeout(() => {
			this._ui.start.hours.number.classList.add('is-decrement-hide');

			setTimeout(() => {
				this._ui.start.hours.number.innerText = dateFns.format(this.start, 'HH');
				this._ui.start.hours.input.value = dateFns.format(this.start, 'HH');
				this._ui.start.hours.number.classList.add('is-decrement-visible');
			}, 100);

			setTimeout(() => {
				this._ui.start.hours.number.classList.remove('is-decrement-hide');
				this._ui.start.hours.number.classList.remove('is-decrement-visible');
			}, 1100);
		}, 100);

		// this.emit(this.options.isRange ? 'select:start' : 'select', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onNextHourStartTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.start = dateFns.addHours(this.start, 1);
		setTimeout(() => {
			this._ui.start.hours.number.classList.add('is-increment-hide');

			setTimeout(() => {
				this._ui.start.hours.number.innerText = dateFns.format(this.start, 'HH');
				this._ui.start.hours.input.value = dateFns.format(this.start, 'HH');
				this._ui.start.hours.number.classList.add('is-increment-visible');
			}, 100);

			setTimeout(() => {
				this._ui.start.hours.number.classList.remove('is-increment-hide');
				this._ui.start.hours.number.classList.remove('is-increment-visible');
			}, 1100);
		}, 100);

		// this._selec(this.time);

		// this.emit(this.options.isRange ? 'select:start' : 'select', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onPreviousMinuteStartTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.start = dateFns.subMinutes(this.start, this.options.minuteSteps);
		setTimeout(() => {
			this._ui.start.minutes.number.classList.add('is-decrement-hide');

			setTimeout(() => {
				this._ui.start.minutes.number.innerText = dateFns.format(this.start, 'mm');
				this._ui.start.minutes.input.value = dateFns.format(this.start, 'mm');
				this._ui.start.minutes.number.classList.add('is-decrement-visible');
				
				if (dateFns.format(this.start, 'HH') !== this._ui.start.hours.input.value) {
					this._ui.start.hours.number.innerText = dateFns.format(this.start, 'HH');
					this._ui.start.hours.input.value = dateFns.format(this.start, 'HH');
					this._ui.start.hours.number.classList.add('is-decrement-visible');
				}
			}, 100);

			setTimeout(() => {
				this._ui.start.minutes.number.classList.remove('is-decrement-hide');
				this._ui.start.minutes.number.classList.remove('is-decrement-visible');
				
				this._ui.start.hours.number.classList.remove('is-decrement-hide');
				this._ui.start.hours.number.classList.remove('is-decrement-visible');
			}, 1100);
		}, 100);

		// this.emit(this.options.isRange ? 'select:start' : 'select', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onNextMinuteStartTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.start = dateFns.addMinutes(this.start, this.options.minuteSteps);
		setTimeout(() => {
			this._ui.start.minutes.number.classList.add('is-increment-hide');

			setTimeout(() => {
				this._ui.start.minutes.number.innerText = dateFns.format(this.start, 'mm');
				this._ui.start.minutes.input.value = dateFns.format(this.start, 'mm');
				this._ui.start.minutes.number.classList.add('is-increment-visible');

				if (dateFns.format(this.start, 'HH') !== this._ui.start.hours.input.value) {
					this._ui.start.hours.number.innerText = dateFns.format(this.start, 'HH');
					this._ui.start.hours.input.value = dateFns.format(this.start, 'HH');
					this._ui.start.hours.number.classList.add('is-increment-visible');
				}
			}, 100);

			setTimeout(() => {
				this._ui.start.minutes.number.classList.remove('is-increment-hide');
				this._ui.start.minutes.number.classList.remove('is-increment-visible');

				this._ui.start.hours.number.classList.remove('is-increment-hide');
				this._ui.start.hours.number.classList.remove('is-increment-visible');
			}, 1100);
		}, 100);

		// this.emit(this.options.isRange ? 'select:start' : 'select', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onPreviousHourEndTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.end = dateFns.subHours(this.end, 1);
		setTimeout(() => {
			this._ui.end.hours.number.classList.add('is-decrement-hide');

			setTimeout(() => {
				this._ui.end.hours.number.innerText = dateFns.format(this.end, 'HH');
				this._ui.end.hours.input.value = dateFns.format(this.end, 'HH');
				this._ui.end.hours.number.classList.add('is-decrement-visible');
			}, 100);

			setTimeout(() => {
				this._ui.end.hours.number.classList.remove('is-decrement-hide');
				this._ui.end.hours.number.classList.remove('is-decrement-visible');
			}, 1100);
		}, 100);

		// this.emit('select:end', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onNextHourEndTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.end = dateFns.addHours(this.end, 1);
		setTimeout(() => {
			this._ui.end.hours.number.classList.add('is-increment-hide');

			setTimeout(() => {
				this._ui.end.hours.number.innerText = dateFns.format(this.end, 'HH');
				this._ui.end.hours.input.value = dateFns.format(this.end, 'HH');
				this._ui.end.hours.number.classList.add('is-increment-visible');
			}, 100);

			setTimeout(() => {
				this._ui.end.hours.number.classList.remove('is-increment-hide');
				this._ui.end.hours.number.classList.remove('is-increment-visible');
			}, 1100);
		}, 100);

		// this.emit('select:end', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onPreviousMinuteEndTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.end = dateFns.subMinutes(this.end, this.options.minuteSteps);
		setTimeout(() => {
			this._ui.end.minutes.number.classList.add('is-decrement-hide');

			setTimeout(() => {
				this._ui.end.minutes.number.innerText = dateFns.format(this.end, 'mm');
				this._ui.end.minutes.input.value = dateFns.format(this.end, 'mm');
				this._ui.end.minutes.number.classList.add('is-decrement-visible');

				if (dateFns.format(this.end, 'HH') !== this._ui.end.hours.input.value) {
					this._ui.end.hours.number.innerText = dateFns.format(this.end, 'HH');
					this._ui.end.hours.input.value = dateFns.format(this.end, 'HH');
					this._ui.end.hours.number.classList.add('is-decrement-visible');
				}
			}, 100);

			setTimeout(() => {
				this._ui.end.minutes.number.classList.remove('is-decrement-hide');
				this._ui.end.minutes.number.classList.remove('is-decrement-visible');
			}, 1100);
		}, 100);

		// this.emit('select:end', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	onNextMinuteEndTimePicker(e) {
		if (!this._supportsPassive) {
			e.preventDefault();
		}
		e.stopPropagation();

		this.end = dateFns.addMinutes(this.end, this.options.minuteSteps);
		setTimeout(() => {
			this._ui.end.minutes.number.classList.add('is-increment-hide');

			setTimeout(() => {
				this._ui.end.minutes.number.innerText = dateFns.format(this.end, 'mm');
				this._ui.end.minutes.input.value = dateFns.format(this.end, 'mm');
				this._ui.end.minutes.number.classList.add('is-increment-visible');

				if (dateFns.format(this.end, 'HH') !== this._ui.end.hours.input.value) {
					this._ui.end.hours.number.innerText = dateFns.format(this.end, 'HH');
					this._ui.end.hours.input.value = dateFns.format(this.end, 'HH');
					this._ui.end.hours.number.classList.add('is-increment-visible');
				}
			}, 100);

			setTimeout(() => {
				this._ui.end.minutes.number.classList.remove('is-increment-hide');
				this._ui.end.minutes.number.classList.remove('is-increment-visible');
			}, 1100);
		}, 100);

		// this.emit('select:end', {
		// 	time: this.time,
		// 	instance: this
		// });
	}

	/****************************************************
	 *                                                  *
	 * PUBLIC FUNCTIONS                                 *
	 *                                                  *
	 ****************************************************/
	isRange() {
		return this.options.isRange;
	}

	show() {
		if (!this._open) {
			this._ui.container.classList.add('is-active');
			this._open = true;
			this._focus = true;

			this.emit('show', this);
		}
	}

	hide() {
		this._open = false;
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
	 * Get / Set TimePicker value
	 * @param {null|time|Object|String} time optional if null then return the current time as String
	 */
	value(value = null) {
		if (value) {
			if (this.options.isRange) {
				if (type.isString(value)) {
					const times = value.split(' - ');
					if (times.length) {
						this.start = dateFns.format(new Date(times[0]), this.format, {
							locale: this.locale
						});
					}
					if (times.length === 2) {
						this.end = dateFns.format(new Date(times[1]), this.format, {
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
			let string = (this.start && this._isValidTime(this.start)) ? dateFns.format(this.start, this.format, {
				locale: this.locale
			}) : '';

			if (this.options.isRange) {
				if (this.end && this._isValidTime(this.end)) {
					string += ` - ${dateFns.format(this.end, this.format, { locale: this.locale })}`;
				}
			}

			return string;
		}
	}

	/**
	 * Refresh Timepicker with new year/month days
	 * @method _refreshTimepicker
	 * @return {[type]}        [description]
	 */
	refresh() {
		this._ui.start.hours.input.value = dateFns.format(this.start, 'HH');
		this._ui.start.hours.number.innerText = dateFns.format(this.start, 'HH');
		this._ui.start.minutes.input.value = dateFns.format(this.start, 'mm');
		this._ui.start.minutes.number.innerText = dateFns.format(this.start, 'mm');
		if (this.options.isRange) {
			this._ui.end.hours.input.value = dateFns.format(this.end, 'HH');
			this._ui.end.hours.number.innerText = dateFns.format(this.end, 'HH');
			this._ui.end.minutes.input.value = dateFns.format(this.end, 'mm');
			this._ui.end.minutes.number.innerText = dateFns.format(this.end, 'mm');
		}

		return this;
	}

	clear() {
		this.time = {
			start: dateFns.startOfToday(),
			end: dateFns.endOfToday()
		};
		this.refresh();
	}

	snapshot() {
		this._snapshots.push({
			...this._time
		});
	}

	render() {
		this.refresh();
		return this.node;
	}
}