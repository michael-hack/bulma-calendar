export default (data) => {
	return `<div class="datetimepicker-selection${data.type === 'time' ? ' is-hidden' : ''}${data.type === 'date' ? ' is-date-only' : ''}">
		<div class="datetimepicker-selection-details">
			<div class="datetimepicker-selection-from${data.labels.from === '' ? ' is-hidden' : ''}">${data.labels.from}</div>
			<div class="datetimepicker-selection-start${data.isRange ? '' : ' is-centered'}">
				<div class="datetimepicker-selection-wrapper">
					<div class="datetimepicker-selection-day"></div>
					<div class="datetimepicker-selection-date">
						<div class="datetimepicker-selection-month"></div>
						<div class="datetimepicker-selection-weekday"></div>
					</div>
				</div>
				${data.type !== 'date' ? `<div class="datetimepicker-selection-time">
					<div class="datetimepicker-selection-time-icon">
						<figure class="image is-16x16">
							${data.icons ? data.icons.time : ''}
						</figure>
					</div>
				</div>` : ''}
			</div>
		</div>
		${data.isRange ? `
		<div class="datetimepicker-selection-details">
			<div class="datetimepicker-selection-to${data.labels.to === '' ? ' is-hidden' : ''}">${data.labels.to}</div>
			<div class="datetimepicker-selection-end">
				<div class="datetimepicker-selection-wrapper">
					<div class="datetimepicker-selection-day"></div>
					<div class="datetimepicker-selection-date">
						<div class="datetimepicker-selection-month"></div>
						<div class="datetimepicker-selection-weekday"></div>
					</div>
				</div>
				${data.type !== 'date' ? `<div class="datetimepicker-selection-time">
					<div class="datetimepicker-selection-time-icon">
						<figure class="image is-16x16">
							${data.icons ? data.icons.time : ''}
						</figure>
					</div>
				</div>` : ''}
			</div>
		</div>` : ''}
	</div>`;
};