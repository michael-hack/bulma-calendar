type BulmaColor = 'primary';

interface Icons {
  previous: string;
  next: string;
  time: string;
  date: string;
}

interface Options {
  type?: 'date' | 'time' | 'datetime';
  color?: BulmaColor;
  isRange?: boolean;
  allowSameDayRange?: boolean;
  lang?: string;
  dateFormat?: string;
  timeFormat?: string;
  displayMode?: 'default' | 'dialog' | 'inline';
  position?: string;
  showHeader?: boolean;
  headerPosition?: 'top' | 'bottom';
  showFooter?: boolean;
  showButtons?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  cancelLabel?: string;
  clearLabel?: string;
  todayLabel?: string;
  nowLabel?: string;
  validateLabel?: string;
  enableMonthSwitch?: boolean;
  enableYearSwitch?: boolean;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledWeekDays?: any[];
  weekStart?: number;
  startTime?: Date;
  endTime?: Date;
  minuteSteps?: number;
  labelFrom?: string;
  labelTo?: string;
  closeOnOverlayClick?: boolean;
  closeOnSelect?: boolean;
  toggleOnInputClick?: boolean;
  onReady?: Function;
  icons?: Icons;
}

type EventType = 'ready' | 'show' | 'hide' | 'select' | 'select:start';

interface Event {
  type: EventType;
  timeStamp: number;
  data: bulmaCalendar;
}

type EventListener = (event: Event) => void;

declare class EventEmitter {
  listenerCount(eventName: EventType): void;

  removeListeners(eventName: EventType, middleware?: boolean): void;

  middleware(eventName: EventType, fn: EventListener): void;

  removeMiddleware(eventName: EventType): void;

  on(name: EventType, callback: EventListener, once?: boolean): void;

  once(name: EventType, callback: EventListener): void;

  emit(name: EventType, data: bulmaCalendar, silent?: boolean): void;
}

interface DateRange {
  start?: Date;
  end?: Date;
}

export default class bulmaCalendar extends EventEmitter {
  constructor(selector: string | HTMLElement, options?: Options);

  static attach(selector?: string | HTMLElement, options?: Options): bulmaCalendar[];

  get id(): string;

  set lang(lang: string);

  get lang(): string;

  set format(format: string);

  get format(): string;

  set date(date: DateRange);

  get date(): DateRange;

  set startDate(date: Date);

  get startDate(): Date;

  set endDate(date: Date);

  get endDate(): Date;

  set minDate(date: Date);

  get minDate(): Date;

  set maxDate(date: Date);

  get maxDate(): Date;

  set dateFormat(dateFormat: string);

  get dateFormat(): string;

  set time(time: DateRange);

  get time(): DateRange;

  set startTime(time: Date);

  get startTime(): Date;

  set endTime(time: Date);

  get endTime(): Date;

  set minTime(time: Date);

  get minTime(): Date;

  set maxTime(time: Date);

  get maxTime(): Date;

  set timeFormat(timeFormat: string);

  get timeFormat(): string;

  isRange(): boolean;

  isOpen(): boolean;

  value(value: string): void;

  // eslint-disable-next-line no-dupe-class-members
  value(): string;

  refresh(): void;

  show(): void;

  hide(): void;

  save(): void;

  snapshot(): void;

  destroy(): void;
}
