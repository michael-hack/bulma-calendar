const defaultOptions = {
    type:                undefined,
    color:               'primary',
    isRange:             false,
    allowSameDayRange:   true,
    lang:                navigator.language || 'en-US', // internationalization
    dateFormat:          'MM/dd/yyyy',
    timeFormat:          'HH:mm',
    displayMode:         'default',
    editTimeManually:    false,
    position:            'auto',
    showHeader:          true,
    headerPosition:      'top',
    showFooter:          true,
    showButtons:         true,
    showTodayButton:     true,
    showClearButton:     true,
    cancelLabel:         'Cancel',
    clearLabel:          'Clear',
    todayLabel:          'Today',
    nowLabel:            'Now',
    validateLabel:       'Validate',
    enableMonthSwitch:   true,
    enableYearSwitch:    true,
    startDate:           undefined,
    endDate:             undefined,
    minDate:             null,
    maxDate:             null,
    disabledDates:       [],
    disabledWeekDays:    undefined,
    highlightedDates:    [],
    weekStart:           0,
    startTime:           undefined,
    endTime:             undefined,
    minuteSteps:         5,
    labelFrom:           '',
    labelTo:             '',
    closeOnOverlayClick: true,
    closeOnSelect:       true,
    toggleOnInputClick:  true,
    onReady:             null,
    onValidate:          null,
    formats:              {
        header:          'LLLL yyyy',
        navigationMonth: 'LLLL',
        navigationYear:  'yyyy',
        selectMonth:     'LLL',
        selectYear:      'yyyy',
        weekday:         'ccc',
    },
    icons:               {
        previous: `<svg viewBox="0 0 50 80" xml:space="preserve">
      <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "/>
    </svg>`,
        next: `<svg viewBox="0 0 50 80" xml:space="preserve">
      <polyline fill="none" stroke-width=".5em" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "/>
    </svg>`,
        time: `<svg version="1.1" x="0px" y="0px" viewBox="0 0 60 60" xml:space="preserve">
      <g>
        <path fill="currentcolor" d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/>
	      <path fill="currentcolor" d="M30,6c-0.552,0-1,0.447-1,1v23H14c-0.552,0-1,0.447-1,1s0.448,1,1,1h16c0.552,0,1-0.447,1-1V7C31,6.447,30.552,6,30,6z"/>
      </g>
    </svg>`,
        date: `<svg version="1.1" x="0px" y="0px" viewBox="0 0 60 60" xml:space="preserve">
      <g>
        <path d="M57,4h-7V1c0-0.553-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1v3H19V1c0-0.553-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1v3H3C2.447,4,2,4.447,2,5v11v43c0,0.553,0.447,1,1,1h54c0.553,0,1-0.447,1-1V16V5C58,4.447,57.553,4,57,4z M43,2h5v3v3h-5V5V2z M12,2h5v3v3h-5V5V2z M4,6h6v3c0,0.553,0.447,1,1,1h7c0.553,0,1-0.447,1-1V6h22v3c0,0.553,0.447,1,1,1h7c0.553,0,1-0.447,1-1V6h6v9H4V6zM4,58V17h52v41H4z"/>
        <path d="M38,23h-7h-2h-7h-2h-9v9v2v7v2v9h9h2h7h2h7h2h9v-9v-2v-7v-2v-9h-9H38z M31,25h7v7h-7V25z M38,41h-7v-7h7V41z M22,34h7v7h-7V34z M22,25h7v7h-7V25z M13,25h7v7h-7V25z M13,34h7v7h-7V34z M20,50h-7v-7h7V50z M29,50h-7v-7h7V50z M38,50h-7v-7h7V50z M47,50h-7v-7h7V50z M47,41h-7v-7h7V41z M47,25v7h-7v-7H47z"/>
      </g>
    </svg>`,
    },
};

export default defaultOptions;
