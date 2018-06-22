export default (data) => {
    return `<div id='${data.id}' class="datepicker ${data.overlay ? 'modal' : ''}">
    ${data.overlay ? '<div class="modal-background"></div>' : ''}
    <div class="calendar">
      <div class="calendar-nav">
        <div class="calendar-nav-month">
          <button class="calendar-nav-previous-month button is-small is-text">${data.icons.month.previous}</button>
          <div class="calendar-month">${data.month}</div>
          <button class="calendar-nav-next-month button is-small is-text">${data.icons.month.next}</button>
        </div>
        <div class="calendar-nav-day">
          <div class="calendar-day">${data.date.day()}</div>
        </div>
        <div class="calendar-nav-year">
          <button class="calendar-nav-previous-year button is-small is-text">${data.icons.year.previous}</button>
          <div class="calendar-year">${data.date.year()}</div>
          <button class="calendar-nav-next-year button is-small is-text">${data.icons.year.next}</button>
        </div>
      </div>
      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-date">${data.getDayName(0, true)}</div>
          <div class="calendar-date">${data.getDayName(1, true)}</div>
          <div class="calendar-date">${data.getDayName(2, true)}</div>
          <div class="calendar-date">${data.getDayName(3, true)}</div>
          <div class="calendar-date">${data.getDayName(4, true)}</div>
          <div class="calendar-date">${data.getDayName(5, true)}</div>
          <div class="calendar-date">${data.getDayName(6, true)}</div>
        </div>
        <div class="calendar-body"></div>
      </div>
    </div>
  </div>`;
};
  