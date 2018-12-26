export default (data) => {
  return `<div id='${data.id}'>
    <div class="bulma-datepicker-wrapper${data.displayMode === 'dialog' ? ' modal' : ''}">
        <div class="modal-background${data.displayMode === 'dialog' ? '' : ' is-hidden'}"></div>
        <div class="bulma-datepicker">
          <div class="bulma-datepicker-container${data.headerPosition === 'top' ? '' : ' has-header-bottom'}"></div>
        </div>
    </div>
  </div>`;
};