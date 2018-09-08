ready(function () {
  bulmaCalendar.attach('#datepickerDemoInline');
  bulmaCalendar.attach('#datepickerDemoInlineRange');

  calendars = bulmaCalendar.attach('#datepickerDemoDefault');
  [].forEach.call(calendars, function (calendar) {
    calendar.on('datepicker:date:selected', function (datePicker) {
      alert('Selected date: ' + datePicker.date);
    });
  });

  bulmaCalendar.attach('#datepickerDemoDialog', {
    displayMode: 'dialog',
    startDate: new Date('02/11/2018'),
    minDate: '01/01/2018',
    maxDate: '12/31/2018',
    lang: 'fr'
  });

  bulmaCalendar.attach('#datepickerDemoDisabledDates', {
    displayMode: 'dialog',
    disabledDates: [
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    ]
  });

  bulmaCalendar.attach('#datepickerDemoDisabledWeekDays', {
    displayMode: 'dialog',
    disabledWeekDays: '0,6'
  });

  bulmaCalendar.attach('#datepickerDemoWeekStart', {
    displayMode: 'dialog',
    weekStart: 1
  });

  bulmaCalendar.attach('#datepickerDemoLabels', {
    displayMode: 'inline',
    isRange: true,
    labelFrom: 'Check-in',
    labelTo: 'Check-out'
  });

  var datepicker = bulmaCalendar.attach('#datepickerDemoTrigger', {
    displayMode: 'dialog',
    toggleOnInputClick: false,
    closeOnSelect: false
  });

  var trigger = document.querySelector('#datepicker-trigger');
  if (trigger) {
    trigger.addEventListener('click', function (e) {
      datepicker[0].show();
    });
  }

  var datepicker2 = bulmaCalendar.attach('#datepickerDemoTrigger2', {
    displayMode: 'dialog',
    isRange: true,
    labelFrom: 'Check-in',
    labelTo: 'Check-out',
    toggleOnInputClick: false
  });
  var trigger2 = document.querySelector('#datepicker-trigger2');
  if (trigger2) {
    trigger2.addEventListener('click', function (e) {
      datepicker2[0].show();
    });
  }
});