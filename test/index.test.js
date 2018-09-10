'use strict';

const bulmaCalendar = require('../src/js/index').default;

describe('bulmaCalendar', () => {
  test('Should return an array of bulmaCalendar instances', () => {
    var instances = bulmaCalendar.attach();
    instances.every(i => expect(i).toBeInstanceOf(bulmaCalendar));
  });
});