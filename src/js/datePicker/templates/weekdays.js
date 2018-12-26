export default (data) => {
	return `<div class="datepicker-weekdays">
		${data.weekdays.map(day => (`<div class="datepicker-date">${day}</div>`)).join('')}
	</div>`;
}