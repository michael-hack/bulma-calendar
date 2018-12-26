export default (data) => {
	return `<div class="bulma-datepicker-selection${data.type === 'time' ? ' is-hidden' : ''}${data.type === 'date' ? ' is-date-only' : ''}">
		<div class="bulma-datepicker-selection-details">
			<div class="bulma-datepicker-selection-from${data.labels.from === '' ? ' is-hidden' : ''}">${data.labels.from}</div>
			<div class="bulma-datepicker-selection-start${data.isRange ? '' : ' is-centered'}">
				<div class="bulma-datepicker-selection-wrapper">
					<div class="bulma-datepicker-selection-day"></div>
					<div class="bulma-datepicker-selection-date">
						<div class="bulma-datepicker-selection-month"></div>
						<div class="bulma-datepicker-selection-weekday"></div>
					</div>
				</div>
			</div>
		</div>
		${data.isRange ? `
		<div class="bulma-datepicker-selection-details">
			<div class="bulma-datepicker-selection-to${data.labels.to === '' ? ' is-hidden' : ''}">${data.labels.to}</div>
			<div class="bulma-datepicker-selection-end">
				<div class="bulma-datepicker-selection-wrapper">
					<div class="bulma-datepicker-selection-day"></div>
					<div class="bulma-datepicker-selection-date">
						<div class="bulma-datepicker-selection-month"></div>
						<div class="bulma-datepicker-selection-weekday"></div>
					</div>
				</div>
			</div>
		</div>` : ''}
	</div>`;
};