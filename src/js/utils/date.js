/**
 * Get the number of days in month
 * @method getDaysInMonth
 * @param  {Integer}       year  Year to check if we are facing a leapyear or not
 * @param  {Integer}       month Month for which we want to know the amount of days
 * @return {Integer}              Days amount
 */
export const getDaysInMonth = (year, month) => {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

/**
 * Compare two dates
 * @method compareDates
 * @param  {Date}     a First date to compare
 * @param  {Date}     b Second Date to compare with
 * @return {Boolean}    True if dates are equal then false
 */
export const compareDates = (a, b) => {
  // weak date comparison
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return a.getTime() === b.getTime();
};

/**
 * Check if given year is LeapYear or not
 * @method isLeapYear
 * @param  {Integer}   year Year to check
 * @return {Boolean}        True if LeapYear then False
 */
export const isLeapYear = year => {
  // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};

/**
 * Parse Date string based on the Date Format given
 * @method parseDate
 * @param  {String}   dateString          Date string to parse
 * @param  {[String}   [format=undefined] Date Format
 * @return {Date}                         Date Object initialized with Date String based on the Date Format
 */
export const parseDate = (dateString, format = undefined) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const formatPattern = /((?:mm?)|(?:dd?)|(?:yyy?y?))[^0-9]((?:mm?)|(?:dd?)|(?:yyy?y?))[^0-9]((?:mm?)|(?:dd?)|(?:yyy?y?))/i;
  const datePattern = /(\d+)[^0-9](\d+)[^0-9](\d+)/i;

  let matchFormat = formatPattern.exec(format);
  if (matchFormat) {
    let matchDate = datePattern.exec(dateString);
    if (matchDate) {
      switch(matchFormat[1][0]) {
      case 'd':
        date.setDate(matchDate[1]);
        break;
      case 'm':
        date.setMonth(matchDate[1] - 1);
        break;
      case 'y':
        date.setFullYear(matchDate[1]);
        break;
      }

      switch(matchFormat[2][0]) {
      case 'd':
        date.setDate(matchDate[2]);
        break;
      case 'm':
        date.setMonth(matchDate[2] - 1);
        break;
      case 'y':
        date.setFullYear(matchDate[2]);
        break;
      }

      switch(matchFormat[3][0]) {
      case 'd':
        date.setDate(matchDate[3]);
        break;
      case 'm':
        date.setMonth(matchDate[3] - 1);
        break;
      case 'y':
        date.setFullYear(matchDate[3]);
        break;
      }
    }
  }

  return date;
};

/**
 * Returns date according to passed format
 * @method getFormatedDate
 * @param {Date}   dt     Date object
 * @param {String} format Format string
 *      d    - day of month
 *      dd   - 2-digits day of month
 *      D    - day of week
 *      m    - month number
 *      mm   - 2-digits month number
 *      M    - short month name
 *      MM   - full month name
 *      yy   - 2-digits year number
 *      yyyy - 4-digits year number
 */
export const getFormatedDate = (dt, format, lang) => {
  var items = {
    d: dt.getDate(),
    dd: dt.getDate(),
    D: dt.getDay(),
    m: dt.getMonth() + 1,
    mm: dt.getMonth() + 1,
    M: dt.getMonth(),
    MM: dt.getMonth(),
    yy: dt.getFullYear().toString().substr(-2),
    yyyy: dt.getFullYear()
  };

  items.dd < 10 && (items.dd = '0' + items.dd);
  items.mm < 10 && (items.mm = '0' + items.mm);
  items.D = lang.weekdays[items.D ? items.D - 1 : 6];
  items.M = lang.monthsShort[items.M];
  items.MM = lang.months[items.MM];

  return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function(m) {
    return typeof items[m] !== 'undefined' ? items[m] : m;
  });
};
