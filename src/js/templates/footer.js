export default (data) => {
	return `<div class="datetimepicker-footer">
		<button type="button" class="datetimepicker-footer-validate has-text-success button is-small is-text ${data.displayMode === 'inline' ? 'is-hidden' : ''}">${data.icons.validate ? data.icons.validate : ''}${data.validateLabel} </button>
		<button type="button" class="datetimepicker-footer-today has-text-warning button is-small is-text">${data.icons.today ? data.icons.today : ''}${data.todayLabel}</button>
		<button type="button" class="datetimepicker-footer-clear has-text-danger button is-small is-text">${data.icons.clear ? data.icons.clear : ''}${data.clearLabel}</button>
		<button type="button" class="datetimepicker-footer-cancel button is-small is-text ${data.displayMode === 'inline' ? 'is-hidden' : ''}">${data.icons.cancel ? data.icons.cancel : ''}${data.cancelLabel}</button>
	</div>`;
};