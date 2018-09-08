import {
  addMonths,
  format,
  getMonth
} from 'date-fns';

export default (data) => {
  return `<div id='${data.id}' class="datepicker ${data.displayMode === 'dialog' ? 'modal' : ''}">
    ${data.displayMode === 'dialog' ? '<div class="modal-background"></div>' : ''}
    <div class="calendar">
      <div class="calendar-header">
        <div class="calendar-selection-start">
          <div class="calendar-selection-from${data.labels.from === '' ? ' is-hidden' : ''}">${data.labels.from}</div>
          <div class="calendar-selection-date">
            <div class="calendar-selection-day"></div>
            <div class="calendar-selection-details">
              <div class="calendar-selection-month"></div>
              <div class="calendar-selection-weekday"></div>
            </div>
          </div>
        </div>
  ${
  data.isRange ? `<div class="calendar-selection-end">
          <div class="calendar-selection-to${data.labels.to === '' ? ' is-hidden' : ''}">${data.labels.to}</div>
          <div class="calendar-selection-date">
            <div class="calendar-selection-day"></div>
            <div class="calendar-selection-details">
              <div class="calendar-selection-month"></div>
              <div class="calendar-selection-weekday"></div>
            </div>
          </div>
        </div>` : ''}
      </div>
      <div class="calendar-nav">
        <button class="calendar-nav-previous button is-small is-text">${data.icons.previous}</button>
        <div class="calendar-nav-month-year">
          <div class="calendar-nav-month">${format(data.visibleDate, 'MMMM', { locale: data.locale })}</div>
          &nbsp;
          <div class="calendar-nav-year">${format(data.visibleDate, 'YYYY', { locale: data.locale })}</div>
        </div>
        <button class="calendar-nav-next button is-small is-text">${data.icons.next}</button>
      </div>
      <div class="calendar-body">
        <div class="calendar-dates is-active">
          <div class="calendar-weekdays">
            ${data.labels.weekdays.map(day => (`<div class="calendar-date">${day}</div>`)).join('')}
          </div>
          <div class="calendar-days"></div>
        </div>
        <div class="calendar-months">
          ${new Array(12).fill(new Date('01/01/1970')).map((d, i) => `<div class="calendar-month" data-month="${format(addMonths(d, i), 'MM', {
    locale: data.locale
  })}">${format(addMonths(d, i), 'MMM', {
    locale: data.locale
  })}</div>`).join('')}
        </div>
        <div class="calendar-years">
          ${data.years.map(year => (`<div class="calendar-year${year === getMonth(data.visibleDate) ? ' is-active' : ''}" data-year="${year}"><span class="item">${year}</span></div>`)).join('')}
        </div>
      </div>
      <div class="calendar-footer">
        <button class="calendar-footer-validate has-text-success button is-small is-text">${data.icons.validate ? data.icons.validate : ''} Validate</button>
        <button class="calendar-footer-today has-text-warning button is-small is-text">${data.icons.today ? data.icons.today : ''} Today</button>
        <button class="calendar-footer-clear has-text-danger button is-small is-text">${data.icons.clear ? data.icons.clear : ''} Clear</button>
        <button class="calendar-footer-cancel button is-small is-text">${data.icons.cancel ? data.icons.cancel : ''} Cancel</button>
      </div>
    </div>
  </div>`;
};