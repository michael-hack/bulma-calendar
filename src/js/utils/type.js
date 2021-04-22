export const isFunction = unknown => typeof unknown === 'function';
export const isString = unknown => (typeof unknown === 'string' || ((!!unknown && typeof unknown === 'object') && Object.prototype.toString.call(unknown) === '[object String]'));
export const isDate = unknown => (Object.prototype.toString.call(unknown) === '[object Date]' || unknown instanceof Date) && !isNaN(unknown.valueOf());
export const isObject = unknown => ((typeof unknown === 'function' || (typeof unknown === 'object' && !!unknown)) && !Array.isArray(unknown));

const falsy = /^(?:f(?:alse)?|no?|0+)$/i;
export const BooleanParse = function (val) {
	return !falsy.test(val) && !!val;
};