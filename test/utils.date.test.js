'use strict';

const bulmaCalendar = require('../src/js/index').default;
const utilsDate = require('../src/js/utils/date');

describe('utils.date', () => {
    test('Should parse different formats correctly', () => {
        let formats = new Array(3);
        //29th OF FABRUARY 2000
        formats[0] = utilsDate.parseDate('29/02/2000', 'dd/mm/yyyy');
        formats[1] = utilsDate.parseDate('02/29/2000', 'mm/dd/yyyy');
        formats[2] = utilsDate.parseDate('2000/02/29', 'yyyy/mm/dd');
        formats.every(i => expect(i).toBeInstanceOf(Date));
        formats.every(i => expect(i.toISOString()).toBe(new Date(2000, 1, 29, 0, 0, 0, 0).toISOString()));
    });
});
