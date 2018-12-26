export const uuid = (prefix = '') => prefix + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

export const detectSupportsPassive = () => {
	let supportsPassive = false;

	try {
		let opts = Object.defineProperty({}, 'passive', {
			get() {
				supportsPassive = true;
			}
		});

		window.addEventListener('testPassive', null, opts);
		window.removeEventListener('testPassive', null, opts);
	} catch (e) {}

	return supportsPassive;
}