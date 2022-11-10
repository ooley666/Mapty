function openEditWindow(e) {
  //choosing the clicked detail
  const clicked = getDOMElements(e);
  if (!clicked.detail) return;
  //preventing other events from firing
  //preventing calculable values from changing
  if (isCalcuable(clicked.detail)) {
    this._showModal(`unchangeable`);
    return;
  }
}

function isCalcuable(clickedDetail) {
  return (
    clickedDetail.dataset.detail === 'pace' ||
    clickedDetail.dataset.detail === 'speed'
  );
}

function getDOMElements(e) {
  return {
    detail: e.target.closest(`.workout__details`),
    workout: this.detail.closest(`.workout`),
    value: this.detail.querySelector(`.workout__value`),
  };
}
