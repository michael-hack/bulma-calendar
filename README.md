# bulma-calendar
Bulma's extension to display a calendar. It can be used on page as large calendar with apointments or in modal/popup for datepicker.
(find all my bulma's extensions [here](https://wikiki.github.io/))

[![npm](https://img.shields.io/npm/v/bulma-calendar.svg)](https://www.npmjs.com/package/bulma-calendar)
[![npm](https://img.shields.io/npm/dm/bulma-calendar.svg)](https://www.npmjs.com/package/bulma-calendar)
[![Build Status](https://travis-ci.org/Wikiki/bulma-calendar.svg?branch=master)](https://travis-ci.org/Wikiki/bulma-calendar)

<img src="https://img4.hostingpics.net/pics/812322ScreenShot20170810at125834.png" width="50%">

# Examples

### Date format

```js
date = new bulmaCalendar(document.querySelector('.sr-date'), {
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

date = new bulmaCalendar(document.querySelector('.sr-date'), {
  lang: 'it' // one of: en (default), fr, de, tr, it, th, pt-BR
});
```

### Other options

Here's the options object and the default values as appears on code.

```js
var defaultOptions = {
  startDate: new Date(),
  // the default data format `field` value
  dateFormat: 'yyyy/mm/dd',
  // internationalization
  lang: 'en',
  overlay: false,
  closeOnSelect: true,
  // callback function
  onSelect: null,   // callback(new Date(year, month, day))
  onOpen: null,     // callback(this)
  onClose: null,    // callback(this)
  onRender: null    // callback(this)
};
```

Documentation & Demo
---
You can find the Documentation and a demo [here](https://wikiki.github.io/components/calendar/)
