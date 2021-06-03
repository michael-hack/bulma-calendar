ready(function () {

    const start = new Date(Date.now() -  24 * 60 * 60 * 1000);
    const end   = new Date(Date.now() +  24 * 60 * 60 * 1000);

    const calendars = bulmaCalendar.attach('.bulmaCalendar');

    calendars.forEach(calendar => {

        calendar.value(start);

        calendar.on('save', function(datepicker) {
            console.log(datepicker.data.value());
        });

    });

    bulmaCalendar.attach('.bulmaCalendarRange', {
        isRange:   true,
        startDate: start,
        endDate:   end
    });

    bulmaCalendar.attach('.bulmaCalendarRangeLabels', {
        isRange:   true,
        labelFrom: 'Check-in',
        labelTo:   'Check-out'
    });

    bulmaCalendar.attach('#datepickerDemoDisabledDates', {
        displayMode:   'dialog',
        disabledDates: [start, end]
    });

    bulmaCalendar.attach('#datepickerDemoDisabledWeekDays', {
        displayMode:      'dialog',
        disabledWeekDays: '0,6'
    });

    bulmaCalendar.attach('#datepickerDemoHighlightedDates', {
        displayMode:      'dialog',
        highlightedDates: [start, end]
    });

    bulmaCalendar.attach('#datepickerDemoWeekStart', {
        displayMode: 'dialog',
        weekStart:   1
    });

});
