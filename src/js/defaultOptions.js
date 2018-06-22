const defaultOptions = {
  selectedDate: new Date(),
  weekStart: null,
  minDate: null,
  maxDate: null,
  disabledDates: [],
  lang: 'en', // internationalization
  overlay: false,
  closeOnOverlayClick: true,
  closeOnSelect: true,
  toggleOnInputClick: true,
  icons: {
    month: {
      previous: `<svg viewBox="0 0 50 80" xml:space="preserve">
        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>
      </svg>`,
      next: `<svg viewBox="0 0 50 80" xml:space="preserve">
        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>
      </svg>`
    },
    year: {
      previous: `<svg viewBox="0 0 50 80" xml:space="preserve">
        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>
      </svg>`,
      next: `<svg viewBox="0 0 50 80" xml:space="preserve">
        <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>
      </svg>`
    }
  }
};

export default defaultOptions;
