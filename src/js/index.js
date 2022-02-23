import * as utils from './utils/index';
import * as type from './utils/type';
import * as dateFns from 'date-fns';
import EventEmitter from './utils/events';

import datePicker from './datePicker';
import timePicker from './timePicker';

import defaultOptions from './defaultOptions';
import template from './templates';
import templateselection from './templates/header';
import templateFooter from './templates/footer';

export default class bulmaCalendar extends EventEmitter {

    constructor(selector, options = {}) {

        super();

        this.element = type.isString(selector) ? document.querySelector(selector) : selector;

        // An invalid selector or non-DOM node has been provided.
        if (!this.element) {
            throw new Error('An invalid selector or non-DOM node has been provided.');
        }

        this._clickEvents     = ['click', 'touch'];
        this._supportsPassive = utils.detectSupportsPassive();

        // Use Element dataset values to override options
        const elementConfig = this.element.dataset
            ? Object.keys(this.element.dataset)
                .filter((key) => Object.keys(defaultOptions).includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: this.element.dataset[key],
                    };
                }, {})
            : {};

        // Set default options - dataset attributes are master
        this.options = {
            ...defaultOptions,
            ...options,
            ...elementConfig,
        };

        if (this.options.type === undefined) {
            switch (this.element.getAttribute('type')) {
                case 'date':
                    this.options.type = 'date';
                    break;
                case 'time':
                    this.options.type = 'time';
                    break;
                default:
                    this.options.type = 'datetime';
                    break;
            }
        }
        this._id = utils.uuid('datetimePicker');

        this.onToggleDateTimePicker        = this.onToggleDateTimePicker.bind(this);
        this.onCloseDateTimePicker         = this.onCloseDateTimePicker.bind(this);
        this.onDocumentClickDateTimePicker = this.onDocumentClickDateTimePicker.bind(this);
        this.onValidateClickDateTimePicker = this.onValidateClickDateTimePicker.bind(this);
        this.onTodayClickDateTimePicker    = this.onTodayClickDateTimePicker.bind(this);
        this.onClearClickDateTimePicker    = this.onClearClickDateTimePicker.bind(this);
        this.onCancelClickDateTimePicker   = this.onCancelClickDateTimePicker.bind(this);
        this.onSelectDateTimePicker        = this.onSelectDateTimePicker.bind(this);
        this.onChangeStartHoursManually    = this.onChangeStartHoursManually.bind(this);
        this.onChangeStartMinutesManually  = this.onChangeStartMinutesManually.bind(this);
        this.onChangeEndHoursManually      = this.onChangeEndHoursManually.bind(this);
        this.onChangeEndMinutesManually    = this.onChangeEndMinutesManually.bind(this);

        // Required Handler
        if (this.element.required) {
            // TODO
        }

        // Initiate plugin
        this._init();

    }

    /**
     * Initiate all DOM element containing datePicker class
     * @method
     * @return {Array} Array of all datePicker instances
     */
    static attach(selector = 'input[type="date"]', options = {}) {

        let instances = [];

        const elements = type.isString(selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
        [].forEach.call(elements, (element) => {
            if (typeof element[this.constructor.name] === 'undefined') {
                const instance        = new bulmaCalendar(element, options);
                element.bulmaCalendar = instance;
                instances.push(instance);
            } else {
                instances.push(element[this.constructor.name]);
            }
        });

        return instances;

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
    set lang(lang) {
        try {
            this._locale = require(`date-fns/locale/${lang}/index.js`);
        } catch (e) {
            lang         = 'en-US';
            this._locale = require(`date-fns/locale/${lang}/index.js`);
        } finally {
            this._lang           = lang;
            this.datePicker.lang = lang;
            this.timePicker.lang = lang;
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
    set date(date) {
        this.datePicker.date = date;
        return this;
    }

    // Get date object
    get date() {
        return this.datePicker.date;
    }

    set startDate(date) {
        this.datePicker.start = date;
        return this;
    }

    get startDate() {
        return this.datePicker.start;
    }

    set endDate(date) {
        this.datePicker.end = date;
        return this;
    }

    get endDate() {
        return this.datePicker.end;
    }

    /**
     * minDate getter and setters
     */
    set minDate(date) {
        this.datePicker.minDate = date;
        return this;
    }

    // Get minDate
    get minDate() {
        return this.datePicker.minDate;
    }

    // Set maxDate
    set maxDate(date) {
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

    /**
     * * Time setter and getter
     */
    set time(time) {
        this.timePicker.time = time;
        return this;
    }

    // Get time object
    get time() {
        return this.timePicker.time;
    }

    set startTime(time) {
        this.timePicker.start = time;
        return this;
    }

    get startTime() {
        return this.timePicker.start;
    }

    set endTime(time) {
        this.timePicker.end = time;
        return this;
    }

    get endTime() {
        return this.timePicker.end;
    }

    /**
     * minTime getter and setters
     */
    set minTime(time) {
        this.timePicker.minTime = time;
        return this;
    }

    // Get minTime
    get minTime() {
        return this.timePicker.minTime;
    }

    // Set maxTime
    set maxTime(time) {
        this.timePicker.maxTime = time;
        return this;
    }

    // Get maxTime
    get maxTime() {
        return this.timePicker.maxTime;
    }

    // Set timeFormat (set to HH:MM:SS by default)
    set timeFormat(timeFormat) {
        this.timePicker.timeFormat = timeFormat;
        return this;
    }

    // Get timeFormat
    get timeFormat() {
        return this.timePicker.timeFormat;
    }

    /****************************************************
     *                                                  *
     * EVENTS FUNCTIONS                                 *
     *                                                  *
     ****************************************************/
    onSelectDateTimePicker(e) {

        this.refresh();
        this.emit(e.type, this);

        if (e.type === 'select' && this.options.closeOnSelect) {
            this.save();
        }

    }

    onDocumentClickDateTimePicker(e) {

        const target = e.target || e.srcElement;

        // Check is e.target not within datepicker element
        if (!this._ui.wrapper.contains(target) && this.options.displayMode !== 'inline') {
            this.hide();
        }

    }

    onToggleDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        this.toggle();

    }

    onValidateClickDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        this.emit('validate', this);

        if (!type.isFunction(this.options.onValidate)) {
            this.save();
        }

    }

    onTodayClickDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        this.datePicker.value(new Date());
        this.timePicker.value(new Date());

        this.refresh();

        if (this.options.closeOnSelect) {
            this.save();
        }

    }

    onClearClickDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        this.clear();

        if (!this.isOpen() || this.options.closeOnSelect) {
            this.save();
        }

    }

    onCancelClickDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        // Reset value
        this.value(this.element.value);

        this.refresh();
        this.save();

    }

    onCloseDateTimePicker(e) {

        if (!this._supportsPassive) {
            e.preventDefault();
        }
        e.stopPropagation();

        this.hide();

    }

    onClickTimeManuallyInput(e) {
        e.currentTarget.select();
    }

    onChangeStartHoursManually(e) {

        this.timePicker.start.setHours(e.currentTarget.value);
        this.refresh();

        if (this.options.closeOnSelect) {
            this.save();
        }

    }

    onChangeStartMinutesManually(e) {

        this.timePicker.start.setMinutes(e.currentTarget.value);
        this.refresh();

        if (this.options.closeOnSelect) {
            this.save();
        }

    }

    onChangeEndHoursManually(e) {

        this.timePicker.end.setHours(e.currentTarget.value);
        this.refresh();

        if (this.options.closeOnSelect) {
            this.save();
        }

    }

    onChangeEndMinutesManually(e) {

        this.timePicker.end.setMinutes(e.currentTarget.value);
        this.refresh();

        if (this.options.closeOnSelect) {
            this.save();
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

    /**
     * Returns true if datetime picker is open, otherwise false.
     * @method isOpen
     * @return {boolean}
     */
    isOpen() {
        return this._open;
    }

    /**
     * Get / Set datetimePicker value
     * @param {*} date
     */
    value(value = null) {

        // Set
        if (value) {

            if (this.options.type == 'datetime') {
                if (this.options.isRange) {

                    if (type.isString(value)) {
                        value = value.split(' - ');
                    }

                    if (Array.isArray(value)) {
                        if (value.length) value[0] = utils.newDate(value[0], this.format);
                        if (value.length === 2) value[1] = utils.newDate(value[1], this.format);
                    }

                } else {
                    if (type.isString(value)) {
                        value = utils.newDate(value, this.format);
                    }
                }
            }

            this.datePicker.value(value);
            this.timePicker.value(value);

            this._refreshInput();
            this.refresh();

            return;

        }

        // Get
        let string = '';

        switch (this.options.type) {

            case 'date':
                string = this.datePicker.value();
                break;

            case 'time':
                string = this.timePicker.value();
                break;

            case 'datetime':

                let start = this.datePicker.start;
                let end   = this.datePicker.end;

                if (start && this.timePicker.start) {

                    start.setHours(this.timePicker.start.getHours());
                    start.setMinutes(this.timePicker.start.getMinutes());

                    string = dateFns.format(start, this.format, { locale: this.locale })

                }

                if (this.options.isRange) {

                    if (end && this.timePicker.end) {
                        end.setHours(this.timePicker.end.getHours());
                        end.setMinutes(this.timePicker.end.getMinutes());
                    }

                    string += ` - ${end ? dateFns.format(end, this.format, { locale: this.locale }) : ''}`;

                }

                break;

        }

        return string;

    }

    refresh() {

        this._ui.header.start.day.innerHTML   = this.datePicker.start ? dateFns.format(this.datePicker.start, 'dd', { locale: this.locale }) : '--';
        this._ui.header.start.month.innerHTML = this.datePicker.start ? dateFns.format(this.datePicker.start, this.options.formats.header, { locale: this.locale }) : '';

        if (this.datePicker.start) {
            this._ui.header.start.weekday.classList.remove('is-hidden');
            this._ui.header.start.weekday.innerHTML = this.datePicker.start ? dateFns.format(this.datePicker.start, 'EEEE', { locale: this.locale }) : '';
        } else {
            this._ui.header.start.weekday.classList.add('is-hidden');
        }

        if (this._ui.header.start.hour) {

            if (this.options.editTimeManually) {
                this._ui.header.start.inputHours.value   = this.timePicker.start ? dateFns.format(this.timePicker.start, 'HH', { locale: this.locale }) : '--';
                this._ui.header.start.inputMinutes.value = this.timePicker.start ? dateFns.format(this.timePicker.start, 'mm', { locale: this.locale }) : '--';
            } else {
                this._ui.header.start.hour.innerHTML = this.timePicker.start ? dateFns.format(this.timePicker.start, 'HH:mm', { locale: this.locale }) : '--:--';
            }

        }

        if (this._ui.header.end) {

            this._ui.header.end.day.innerHTML =
                this.options.isRange && this.datePicker.end ? dateFns.format(this.datePicker.end, 'dd', { locale: this.locale }) : '--';

            this._ui.header.end.month.innerHTML =
                this.options.isRange && this.datePicker.end ? dateFns.format(this.datePicker.end, this.options.formats.header, { locale: this.locale }) : '';

            if (this.datePicker.end) {
                this._ui.header.end.weekday.classList.remove('is-hidden');
                this._ui.header.end.weekday.innerHTML = this.datePicker.end ? dateFns.format(this.datePicker.end, 'EEEE', { locale: this.locale }) : '';
            } else {
                this._ui.header.end.weekday.classList.add('is-hidden');
            }

            if (this._ui.header.end && this._ui.header.end.hour) {
                if (this.options.editTimeManually) {
                    this._ui.header.end.inputHours.value   = this.timePicker.end ? dateFns.format(this.timePicker.end, 'HH', { locale: this.locale }) : '--';
                    this._ui.header.end.inputMinutes.value = this.timePicker.end ? dateFns.format(this.timePicker.end, 'mm', { locale: this.locale }) : '--';
                } else {
                    this._ui.header.end.hour.innerHTML = this.timePicker.end ? dateFns.format(this.timePicker.end, 'HH:mm', { locale: this.locale }) : '--:--';
                }
            }

        }

        this.emit('refresh', this);

    }

    clear() {

        this.datePicker.clear();
        this.timePicker.clear();

        this.refresh();

        if (!this.isOpen()) {
            this._refreshInput();
        }

        this.emit('clear', this);

    }

    /**
     * Show datePicker HTML Component
     * @method show
     * @return {void}
     */
    show() {

        this.datePicker.show();
        this.timePicker.show();

        if (this._ui.modal) {
            this._ui.modal.classList.add('is-active');
        }

        this._ui.dummy.wrapper.classList.add('is-active');
        this._ui.wrapper.classList.add('is-active');
        this._open = true;

        this.emit('show', this);

    }

    /**
     * Toggle Component
     */
    toggle() {
        if (this._open) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Hide datePicker HTML Component
     * @method hide
     * @return {void}
     */
    hide() {

        if (!this._open) return;

        this.datePicker.hide();
        this.timePicker.hide();

        this._open  = false;
        this._focus = false;
        if (this._ui.modal) {
            this._ui.modal.classList.remove('is-active');
        }

        this._ui.dummy.wrapper.classList.remove('is-active');
        this._ui.wrapper.classList.remove('is-active');

        this.emit('hide', this);

    }

    // Set element value to datetime selected based on format
    save() {

        this._refreshInput();

        if (this.options.displayMode !== 'inline') {
            this.hide();
        }

        this.emit('save', this);

    }

    /**
     * Destroy datePicker
     * @method destroy
     */
    destroy() {

        document.getElementById(this.id).remove();

        this.datePicker = null;
        this.timePicker = null;

        this._ui = null;

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

        this._open = false;
        this._type = ['date', 'time', 'datetime'].indexOf(this.options.type.toLowerCase()) > -1 ? this.options.type.toLowerCase() : 'date'; // Set component type (date / time / datetime)

        // Change element type to prevent browser default type="date" behavior
        this.element.setAttribute('type', 'text');

        // create pickers
        this.datePicker = new datePicker({ ...this.options });
        this.timePicker = new timePicker({ ...this.options });

        this.lang   = this.options.lang;
        this.format = this._type === 'date' ? this.options.dateFormat : this._type === 'time' ? this.options.timeFormat : `${this.options.dateFormat} ${this.options.timeFormat}`; // Set export format based on component type

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

        // apply value to picker
        if (this.element.value) {
            this.value(this.element.value);
        }

        this._refreshInput();

        // Callbacks
        if (type.isFunction(this.options.onReady)) {
            this.on('ready', this.options.onReady);
        }
        if (type.isFunction(this.options.onValidate)) {
            this.on('validate', this.options.onValidate);
        }

        this.emit('ready', this);

    }

    /**
     * Build datePicker HTML component and append it to the DOM
     * @method _build
     * @return {datePicker} Current plugin instance
     */
    _build() {
        const headerNode         = document.createRange().createContextualFragment(
            templateselection({
                ...this.options,
                type:       this._type,
                datePicker: this.options.type !== 'time',
                timePicker: this.options.type !== 'date',
            })
        );
        const footerNode         = document.createRange().createContextualFragment(templateFooter(this.options));
        const datetimePickerNode = document.createRange().createContextualFragment(
            template({
                ...this.options,
                id: this.id,
            })
        );

        // Save pointer to each datePicker element for later use
        this._ui = {
            modal:     datetimePickerNode.querySelector('.datetimepicker-wrapper.modal'),
            wrapper:   datetimePickerNode.querySelector('.datetimepicker'),
            container: datetimePickerNode.querySelector('.datetimepicker-container'),
            dummy:     {
                container: datetimePickerNode.querySelector('.datetimepicker-dummy'),
                wrapper:   datetimePickerNode.querySelector('.datetimepicker-dummy-wrapper'),
                dummy_1:   datetimePickerNode.querySelector('.datetimepicker-dummy .datetimepicker-dummy-input:nth-child(1)'),
                dummy_2:   datetimePickerNode.querySelector('.datetimepicker-dummy .datetimepicker-dummy-input:nth-child(2)'),
                clear:     datetimePickerNode.querySelector('.datetimepicker-dummy .datetimepicker-clear-button'),
            },
            calendar:  datetimePickerNode.querySelector('.datetimepicker'),
            overlay:
                       this.options.displayMode === 'dialog'
                           ? {
                               background: datetimePickerNode.querySelector('.modal-background'),
                               close:      datetimePickerNode.querySelector('.modal-close'),
                           }
                           : undefined,
            header:    {
                container: headerNode.querySelector('.datetimepicker-header'),
                start:     {
                    container:    headerNode.querySelector('.datetimepicker-selection-start'),
                    day:          headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-day'),
                    month:        headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-month'),
                    weekday:      headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-weekday'),
                    hour:         headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-hour'),
                    inputHours:   headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-hour.editable .datetimepicker-selection-input-hours'),
                    inputMinutes: headerNode.querySelector('.datetimepicker-selection-start .datetimepicker-selection-hour.editable .datetimepicker-selection-input-minutes'),
                    empty:        headerNode.querySelector('.datetimepicker-selection-start .empty'),
                },
                end:       this.options.isRange
                               ? {
                        container:    headerNode.querySelector('.datetimepicker-selection-end'),
                        day:          headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-day'),
                        month:        headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-month'),
                        weekday:      headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-weekday'),
                        hour:         headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-hour'),
                        inputHours:   headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-hour.editable .datetimepicker-selection-input-hours'),
                        inputMinutes: headerNode.querySelector('.datetimepicker-selection-end .datetimepicker-selection-hour.editable .datetimepicker-selection-input-minutes'),
                        empty:        headerNode.querySelector('.datetimepicker-selection-start .empty'),
                    }
                               : undefined,
            },
            footer:    {
                container: footerNode.querySelector('.datetimepicker-footer'),
                validate:  footerNode.querySelector('.datetimepicker-footer-validate'),
                today:     footerNode.querySelector('.datetimepicker-footer-today'),
                clear:     footerNode.querySelector('.datetimepicker-footer-clear'),
                cancel:    footerNode.querySelector('.datetimepicker-footer-cancel'),
            },
        };

        if (!type.BooleanParse(this.options.showHeader)) {
            this._ui.header.container.classList.add('is-hidden');
        }
        if (!type.BooleanParse(this.options.showFooter)) {
            this._ui.footer.container.classList.add('is-hidden');
        }
        if (!type.BooleanParse(this.options.showTodayButton)) {
            this._ui.footer.today.classList.add('is-hidden');
        }
        if (!type.BooleanParse(this.options.showClearButton)) {
            this._ui.footer.clear.classList.add('is-hidden');
        }

        if (this.options.closeOnSelect && this._ui.footer.validate) {
            this._ui.footer.validate.classList.add('is-hidden');
        }

        this._ui.container.appendChild(headerNode);
        switch (this._type) {
            case 'date':
                this._ui.container.appendChild(this.datePicker.render());
                break;
            case 'time':
                this.options.closeOnSelect = false;
                this._ui.container.appendChild(this.timePicker.render());
                if (this.options.labelFrom || this.options.labelTo) {
                    this._ui.header.container.classList.remove('is-hidden');
                }
                if (this._ui.footer.validate) {
                    this._ui.footer.validate.classList.remove('is-hidden');
                }
                if (this._ui.footer.today) {
                    this._ui.footer.today.classList.add('is-hidden');
                }
                break;
            case 'datetime':
                this.options.closeOnSelect = false;
                if (this._ui.footer.validate) {
                    this._ui.footer.validate.classList.remove('is-hidden');
                }
                this._ui.container.appendChild(this.datePicker.render());
                this._ui.container.appendChild(this.timePicker.render());
                break;
        }

        this._ui.wrapper.appendChild(footerNode);
        this._ui.wrapper.classList.add(`is-${this.options.color}`);
        this._ui.dummy.container.classList.add(`is-${this.options.color}`);
        // Add datepicker HTML element to Document Body
        this.element.parentNode.insertBefore(datetimePickerNode, this.element.nextSibling);
        this._ui.dummy.wrapper.appendChild(this.element);
        this.element.classList.add('is-hidden');

        if (this.options.displayMode === 'inline') {
            this._ui.wrapper.classList.add('is-active');
        } else {
            this._ui.dummy.container.classList.remove('is-hidden');
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

        this._clickEvents.forEach((clickEvent) => {
            document.body.addEventListener(clickEvent, this.onDocumentClickDateTimePicker);
        });

        this.datePicker.on('select', this.onSelectDateTimePicker);
        this.datePicker.on('select:start', this.onSelectDateTimePicker);
        this.timePicker.on('select', this.onSelectDateTimePicker);
        this.timePicker.on('select:start', this.onSelectDateTimePicker);

        // Bind event to element in order to display/hide datePicker on click
        if (this.options.toggleOnInputClick === true) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.dummy.wrapper.addEventListener(clickEvent, this.onToggleDateTimePicker);
                this.element.addEventListener(clickEvent, this.onToggleDateTimePicker);
            });
        }

        // Bind change time events for header inputs
        if (this.options.type !== 'date' && this.options.editTimeManually) {
            // Bind event for start hours change
            this._ui.header.start.inputHours.addEventListener('change', this.onChangeStartHoursManually);
            this._ui.header.start.inputHours.addEventListener('click', this.onClickTimeManuallyInput);
            // Bind event for start minutes change
            this._ui.header.start.inputMinutes.addEventListener('change', this.onChangeStartMinutesManually);
            this._ui.header.start.inputMinutes.addEventListener('click', this.onClickTimeManuallyInput);
            if (this.options.isRange) {
                // Bind event for end hours change
                this._ui.header.end.inputHours.addEventListener('change', this.onChangeEndHoursManually);
                this._ui.header.end.inputHours.addEventListener('click', this.onClickTimeManuallyInput);
                // Bind event for end minutes change
                this._ui.header.end.inputMinutes.addEventListener('change', this.onChangeEndMinutesManually);
                this._ui.header.end.inputMinutes.addEventListener('click', this.onClickTimeManuallyInput);
            }
        }

        if (this.options.displayMode === 'dialog' && this._ui.overlay) {
            // Bind close event on Close button
            if (this._ui.overlay.close) {
                this._clickEvents.forEach((clickEvent) => {
                    this.this._ui.overlay.close.addEventListener(clickEvent, this.onCloseDateTimePicker);
                });
            }
            // Bind close event on overlay based on options
            if (this.options.closeOnOverlayClick && this._ui.overlay.background) {
                this._clickEvents.forEach((clickEvent) => {
                    this._ui.overlay.background.addEventListener(clickEvent, this.onCloseDateTimePicker);
                });
            }
        }

        if (this._ui.footer.validate) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.footer.validate.addEventListener(clickEvent, this.onValidateClickDateTimePicker);
            });
        }
        if (this._ui.footer.today) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.footer.today.addEventListener(clickEvent, this.onTodayClickDateTimePicker);
            });
        }
        if (this._ui.footer.clear) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.footer.clear.addEventListener(clickEvent, this.onClearClickDateTimePicker);
            });
        }
        this._clickEvents.forEach((clickEvent) => {
            this._ui.dummy.clear.addEventListener(clickEvent, this.onClearClickDateTimePicker);
        });
        if (this._ui.footer.cancel) {
            this._clickEvents.forEach((clickEvent) => {
                this._ui.footer.cancel.addEventListener(clickEvent, this.onCancelClickDateTimePicker);
            });
        }

    }

    /**
     * Refresh Input
     * @private
     */
    _refreshInput() {

        const [start, end] = this.value().split(' - ');

        this._ui.dummy.dummy_1.value = start ? start : '';

        if (this._ui.dummy.dummy_2) {
            this._ui.dummy.dummy_2.value = end ? end : '';
        }

        this.element.setAttribute('value', this.value());

    }

}
