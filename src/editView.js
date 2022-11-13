export function handleEdits(e) {
  const clickedDetailData = openEditWindow.call(this, e);
  clickedDetailData.editInput.focus();
  submitEdit.call(this, clickedDetailData);
}

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
  const html = `<form class ="form--edit">
                      <label></label> 
                      <input type="text" placeholder="${clicked.value.textContent}"class ="form--edit__input"></input>
                      </form>`;
  clicked.value.insertAdjacentHTML(`afterbegin`, html);
  clicked.editForm = document.querySelector(`.form--edit`);
  clicked.editInput = document.querySelector(`.form--edit__input`);

  return clicked;
}
function submitEdit(detailData) {
  detailData.targetObj = getCorrespondingWorkout.call(this, detailData.workout);
  detailData.editForm.addEventListener(
    `submit`,
    function (e) {
      e.preventDefault();
      submitEventHandler.call(this, detailData);
    }.bind(this)
  );
}

function submitEventHandler(detailData) {
  applyChangesToTargetObject(detailData);
  this._setLocalStorage();
  detailData.editForm.remove();
}
function applyChangesToTargetObject(detailData) {
  const userInput = detailData.editInput.value;
  const editedValueName = detailData.detail.dataset.detail;
  const paceOrSpeed = detailData.workout.querySelector(
    `#pacespeed .workout__value`
  );
  //changing the value in the object
  detailData.targetObj[editedValueName] = detailData.value.textContent =
    userInput;

  switch (detailData.targetObj.type) {
    case `running`:
      detailData.targetObj.getPace();
      paceOrSpeed.textContent = detailData.targetObj.pace;
      break;

    case `cycling`:
      detailData.targetObj.getSpeed();
      paceOrSpeed.textContent = detailData.targetObj.speed;
      break;
  }
}
function isCalcuable(clickedDetail) {
  return (
    clickedDetail.dataset.detail === 'pace' ||
    clickedDetail.dataset.detail === 'speed'
  );
}

function getDOMElements(e) {
  const targetDetail = e.target.closest(`.workout__details`);
  const DOMElements = {
    detail: targetDetail,
    workout: targetDetail.closest(`.workout`),
    value: targetDetail.querySelector(`.workout__value`),
  };
  return DOMElements;
}
function getCorrespondingWorkout(clickedWorkout) {
  return this.workouts.find(
    workout => workout.id === clickedWorkout.dataset.id
  );
}
