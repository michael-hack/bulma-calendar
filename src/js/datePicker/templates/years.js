import {
	getMonth
} from 'date-fns';

export default (data) => {
	return `${data.years.map(year => (`<div class="datepicker-year${year === getMonth(data.visibleDate) ? ' is-active' : ''}" data-year="${year}"><span class="item">${year}</span></div>`)).join('')}`;
}