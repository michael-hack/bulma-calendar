ready(function () {
  bulmaCalendar.attach('#datepickerDemoInline', {
    onReady: function(datepicker) {
      alert('Inline ready');
    }
  });
  bulmaCalendar.attach('#datepickerDemoInlineRange');
  bulmaCalendar.attach('#datepickerDemoRangeDialog', {
    displayMode: 'dialog'
  });

  calendars = [bulmaCalendar.attach('#datepickerDemoDefault', {
    dateFormat: 'DD/MM/YYYY',
    clearButton: false
  })];

  [].forEach.call(calendars, function (calendar) {
    calendar.on('select', function (datePicker) {
      console.log('Selected date: ' + datePicker.data.value());
    });
  });

  bulmaCalendar.attach('#datepickerDemoDialog', {
    displayMode: 'dialog',
    dateFormat: 'D/M/YYYY',
    startDate: new Date(),
    minDate: '01/01/2018',
    maxDate: '12/31/2018'
  });

  bulmaCalendar.attach('#datepickerDemoDisabledDates', {
    displayMode: 'dialog',
    startDate: new Date(),
    disabledDates: [
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    ]
  });

  bulmaCalendar.attach('#datepickerDemoDisabledWeekDays', {
    displayMode: 'dialog',
    startDate: new Date(),
    disabledWeekDays: '0,6'
  });

  bulmaCalendar.attach('#datepickerDemoWeekStart', {
    displayMode: 'dialog',
    startDate: new Date(),
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
      datepicker.show();
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
    trigger2.addEventListener('click', function(e) {
      datepicker2.show();
    });
  }
});