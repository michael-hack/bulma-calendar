const defaultOptions = {
    color:                 'primary',
    isRange:               false,
    allowSameDayRange:     true,
    lang:                  'en-US', // internationalization
    startDate:             undefined,
    endDate:               undefined,
    minDate:               null,
    maxDate:               null,
    disabledDates:         [],
    disabledWeekDays:      undefined,
    highlightedDates:      [],
    weekStart:             0,
    dateFormat:            'MM/dd/yyyy',
    enableMonthSwitch:     true,
    enableYearSwitch:      true,
    displayYearsCount:     50,
    formats: {
        header:          'LLLL yyyy',
        navigationMonth: 'LLLL',
        navigationYear:  'yyyy',
        selectMonth:     'LLL',
        selectYear:      'yyyy',
        weekday:         'ccc',
    },
};

export default defaultOptions;
