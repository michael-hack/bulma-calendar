import { format } from 'date-fns';

export default (data) => {
    return `<div class="datepicker-weekdays">
        ${data.days.map(day => (`<div class="datepicker-date">
            ${format(day, data.format, { locale: data.locale })}
        </div>`)).join('')}
    </div>`;
}
