export default (days) => {
  return `${days.map(theDate => (
    `<div data-date="${theDate.date.toString()}" class="calendar-date${theDate.isThisMonth ? ' is-current-month' : ''}${theDate.isDisabled ? ' is-disabled' : ''}${theDate.isRange && theDate.isInRange ? ' calendar-range' : ''}${theDate.isStartDate ? ' calendar-range-start' : ''}${theDate.isEndDate ? ' calendar-range-end' : ''}">
      <button class="date-item${theDate.isToday ? ' is-today' : ''}${theDate.isStartDate ? ' is-active' : ''}">${theDate.date.getDate()}</button>
  </div>`)).join('')}`;
};