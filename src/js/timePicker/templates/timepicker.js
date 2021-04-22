export default (data) => {
  return `<div class="timepicker${data.editTimeManually ? ' is-hidden' : ''}">
    <div class="timepicker-start">
      <div class="timepicker-hours">
        <span class="timepicker-next">+</span>
        <div class="timepicker-input">
          <input type="number">
          <div class="timepicker-input-number"></div>
        </div>
        <span class="timepicker-previous">-</span>
      </div>
      <div class="timepicker-time-divider">:</div>
      <div class="timepicker-minutes">
        <span class="timepicker-next">+</span>
        <div class="timepicker-input">
          <input type="number">
          <div class="timepicker-input-number"></div>
        </div>
        <span class="timepicker-previous">-</span>
      </div>
    </div>
    ${data.isRange ? `<div class="timepicker-end">
      <div class="timepicker-hours">
        <span class="timepicker-next">+</span>
        <div class="timepicker-input">
          <input type="number">
          <div class="timepicker-input-number"></div>
        </div>
        <span class="timepicker-previous">-</span>
      </div>
      <div class="timepicker-time-divider">:</div>
      <div class="timepicker-minutes">
        <span class="timepicker-next">+</span>
        <div class="timepicker-input">
          <input type="number">
          <div class="timepicker-input-number"></div>
        </div>
        <span class="timepicker-previous">-</span>
      </div>
    </div>`: ''}
  </div>`;
};