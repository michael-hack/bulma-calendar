export default (data) => {
	return `<div class="bulma-datepicker-footer">
		<button class="bulma-datepicker-footer-validate has-text-success button is-small is-text ${data.displayMode === 'inline' ? 'is-hidden' : ''}" type="button">${data.icons.validate ? data.icons.validate : ''}${data.validateLabel} </button>
		<button class="bulma-datepicker-footer-today has-text-warning button is-small is-text" type="button">${data.icons.today ? data.icons.today : ''}${data.todayLabel}</button>
		<button class="bulma-datepicker-footer-clear has-text-danger button is-small is-text" type="button">${data.icons.clear ? data.icons.clear : ''}${data.clearLabel}</button>
		<button class="bulma-datepicker-footer-cancel button is-small is-text ${data.displayMode === 'inline' ? 'is-hidden' : ''}" type="button">${data.icons.cancel ? data.icons.cancel : ''}${data.cancelLabel}</button>
	</div>`;
};