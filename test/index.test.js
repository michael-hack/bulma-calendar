'use strict';
import moment from 'moment';

jest.useFakeTimers();
const bulmaCalendar = require('../src/js/index').default;

describe('bulmaCalendar', () => {
  // Set up our document body
  document.body.innerHTML =
    `<div>
      <input type="date" /> 
      <input type="date" class="selector" />
    </div>`;



  test('Should throw exception if instanciate with no/wrong selector', () => {
    expect(() => {
      new bulmaCalendar();
    }).toThrow('An invalid selector or non-DOM node has been provided.');
  });

  test('Should return an array', () => {
    let instances = bulmaCalendar.attach('.selector');
    jest.runOnlyPendingTimers();
    expect(instances.length).toBe(1);
    expect(Array.isArray(instances)).toBe(true);
  });

  test('Should return an array of bulmaCalendar instances', () => {
    let instances = bulmaCalendar.attach(undefined);
    jest.runOnlyPendingTimers();
    expect(instances.length).toBe(2);
    instances.every(i => expect(i).toBeInstanceOf(bulmaCalendar));

  });

  test('Should return an array of bulmaCalendar instances with options', () => {
    let instances = bulmaCalendar.attach('[type="date"]', {
      minDate: '2018-01-01',
      maxDate: '2018-12-31',
      dateFormat: 'yyyy-mm-dd',
    });
    jest.runOnlyPendingTimers();
    expect(instances.length).toBe(2);
    instances.every(i => expect(i).toBeInstanceOf(bulmaCalendar));
  });

  test('Selected date', () => {
    let date = moment(new Date());
    let instances = bulmaCalendar.attach('[type="date"]', {
      selectedDate: date
    });
    jest.runOnlyPendingTimers();
    expect(instances.length).toBe(2);
    instances.every(i =>expect(i.date.format("DD-MM-YYYY")).toBe(date.format("DD-MM-YYYY")));
  });

  test('Change date', () => {
    //Setting first day of CURRENT month
    //We cant do across monthes since the calendar only allows to select inside the 30ish days of the month
    let date = moment(new Date());
    date.date(1)

    let dateFormat = 'YYYY-MM-DD';
    let instances = bulmaCalendar.attach('[type="date"]', {
      selectedDate: date,
      dateFormat: dateFormat
    });

    jest.runOnlyPendingTimers();
    expect(instances.length).toBe(2); //just in case instances are not working. we need them to fail. Otherwise tests will pass.
   
    instances.every(i=>i.show()); // show the calendar to render to ROM

    let newDate = moment(date);
    newDate.date(newDate.date() + 15) //copy date and add 15 days.

    const dateString = newDate
                      .format(dateFormat)
                      .toString(); //Only going to tests against YMD for now. Until timepicker are implemented

    var daysBtn = document.querySelectorAll(`div[data-date="${dateString}"] button`); //get all buttons that matches the day from (in this case both) calendars.

    [].forEach.call(daysBtn, (dayBtn) => dayBtn.click()); 

    instances.every(i =>expect(i.date.format("DD-MM-YYYY")).toBe(newDate.format("DD-MM-YYYY"))); //after clicking on them, the instance.date and +15 should match.
  });
});
