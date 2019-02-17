const defaultOptions = {
  startDate: undefined,
  endDate: undefined,
  minDate: null,
  maxDate: null,
  isRange: false,
  allowSameDayRange: true,
  disabledDates: [],
  disabledWeekDays: undefined,
  lang: 'en', // internationalization
  dateFormat: 'MM/DD/YYYY',
  displayMode: 'default',
  showHeader: true,
  showFooter: true,
  todayButton: true,
  clearButton: true,
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  todayLabel: 'Today',
  nowLabel: 'Now',
  validateLabel: 'Validate',
  labelFrom: '',
  labelTo: '',
  weekStart: 0,
  weekDaysFormat: 'ddd',
  closeOnOverlayClick: true,
  closeOnSelect: true,
  toggleOnInputClick: true,
  onReady: null,
  icons: {
    previous: `<svg viewBox="0 0 50 80" xml:space="preserve">
      <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>
    </svg>`,
    next: `<svg viewBox="0 0 50 80" xml:space="preserve">
      <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>
    </svg>`
  }
};

export default defaultOptions;