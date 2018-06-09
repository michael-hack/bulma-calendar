# bulma-calendar
Bulma's extension to display a calendar. It can be used on page as large calendar with apointments or in modal/popup for datepicker.
(find all my bulma's extensions [here](https://wikiki.github.io/))

[![npm](https://img.shields.io/npm/v/bulma-calendar.svg)](https://www.npmjs.com/package/bulma-calendar)
[![npm](https://img.shields.io/npm/dm/bulma-calendar.svg)](https://www.npmjs.com/package/bulma-calendar)
[![Build Status](https://travis-ci.org/Wikiki/bulma-calendar.svg?branch=master)](https://travis-ci.org/Wikiki/bulma-calendar)


# Examples

### Date format

```js
date = bulmaCalendar.attach(document.querySelector('.sr-date'), {
  dataFormat: 'd MM yyyy' // 1 January 2018
});
```

where `dataFormat` is a string with a combination of this values:

```
d: short day (1-31)
dd: long day (00-31)
D: weekday (es: Monday)
m: short month (1-12)
mm: long month (01-12)
M: short month name (es: Jan, Feb)
MM: full month name (es: January)
yy: short year (18)
yyyy: full year (2018)
```

### Language

```js

date = bulmaCalendar.attach(document.querySelector('.sr-date'), {
  lang: 'it' // one of: en (default), fr, de, tr, it, th, pt-BR
});
```

### Other options

Here's the options object and the default values as appears on code.

```js
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
  };
```

Documentation & Demo
---
You can find the Documentation and a demo [here](https://wikiki.github.io/components/calendar/)
