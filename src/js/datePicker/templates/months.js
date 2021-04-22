import {
  addMonths,
  format
} from 'date-fns';

export default (data) => {
  return `${data.months.map((d, i) => `<div class="datepicker-month" data-month="${format(addMonths(d, i), 'MM', {
    locale: data.locale
  })}">${format(addMonths(d, i), 'MMM', {
    locale: data.locale
  })}</div>`).join('')}`;
}