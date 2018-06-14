'use strict';

const bulmaCalendar = require('../src/js/index').default;

describe('bulmaCalendar', () => {
  test('Should throw exception if instanciate with no/wrong selector', () => {
    expect(() => {
      new bulmaCalendar();
    }).toThrow('An invalid selector or non-DOM node has been provided.');
  });

  test('Should return an array', () => {
    var instances = bulmaCalendar.attach('.selector');
    expect(Array.isArray(instances)).toBe(true);
  });

  test('Should return an array of bulmaCalendar instances', () => {
    var instances = bulmaCalendar.attach();
    instances.every(i => expect(i).toBeInstanceOf(bulmaCalendar));
  });

  test('Should return an array of bulmaCalendar instances with options', () => {
    var instances = bulmaCalendar.attach('[type="date"]', {
      minDate: '2018-01-01',
      maxDate: '2018-12-31',
      dateFormat: 'yyyy-mm-dd',
    });
    instances.every(i => expect(i).toBeInstanceOf(bulmaCalendar));
  });
});
