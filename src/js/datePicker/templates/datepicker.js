export default (data) => {
  return `<div class="datepicker">
    <div class="datepicker-nav">
        <button type="button" class="datepicker-nav-previous button is-small is-text">${data.icons.previous}</button>
        <div class="datepicker-nav-month-year">
          <div class="datepicker-nav-month"></div>
          &nbsp;
          <div class="datepicker-nav-year"></div>
        </div>
        <button type="button" class="datepicker-nav-next button is-small is-text">${data.icons.next}</button>
      </div>
      <div class="datepicker-body">
        <div class="datepicker-dates is-active"></div>
        <div class="datepicker-months"></div>
        <div class="datepicker-years"></div>
      </div>
    </div>`;
};