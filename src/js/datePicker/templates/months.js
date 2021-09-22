import { format } from 'date-fns';

export default (data) => {
    return `${data.months.map(month => (`
        <div class="datepicker-month" data-month="${format(month, 'MM', { locale: data.locale })}">
            ${format(month, 'LLL', { locale: data.locale })}
        </div>
    `)).join('')}`;
}
