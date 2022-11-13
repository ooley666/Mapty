import { View } from './View.js';
import { setLocalStorage } from './localStorage.js';
class EditView extends View {
  event;
  workoutsArray = [];
  detailToEdit;
  workoutToEdit;
  detailToEditValue;

  editForm;
  editFormInputField;
  handleEdits(e, workoutsArray) {
    this.eventTarget = e.target;
    this.workoutsArray = workoutsArray;
    this._getDOMElements();
    if (!this.detailToEdit) return;
    if (this._isComputed(this.detailToEdit)) {
      this._showModal(`unchangeable`);
      return;
    }
    this._openEditWindow();
    this._getEditFormAndInput();
    this.editFormInputField.focus();
    this._submitEdit();
  }
  _getDOMElements() {
    this.detailToEdit = this.eventTarget.closest(`.workout__details`);
    if (!this.detailToEdit) return;

    this.workoutToEdit = this.detailToEdit.closest(`.workout`);
    this.detailToEditValue = this.detailToEdit.querySelector(`.workout__value`);
    console.log(this.workoutsArray);
  }
  _openEditWindow() {
    const html = `<form class ="form--edit">
                      <label></label> 
                      <input type="text" placeholder="${this.detailToEditValue.textContent}"class ="form--edit__input"></input>
                      </form>`;
    this.detailToEditValue.insertAdjacentHTML(`afterbegin`, html);
  }
  _isComputed(detailToEdit) {
    return (
      detailToEdit.dataset.detail === 'pace' ||
      detailToEdit.dataset.detail === 'speed'
    );
  }
  _getEditFormAndInput() {
    this.editForm = document.querySelector(`.form--edit`);
    this.editFormInputField = document.querySelector(`.form--edit__input`);
  }
  _submitEdit() {
    this.editForm.addEventListener(
      `submit`,
      function (e) {
        e.preventDefault();
        this._applyChangesToCorrespondingWorkout();
        setLocalStorage(this.workoutsArray);
        this.editForm.remove();
      }.bind(this)
    );
  }
  _applyChangesToCorrespondingWorkout() {
    const storedWorkout = this._getStoredWorkout();
    const userInput = this.editFormInputField.value;
    const editedValueName = this.detailToEdit.dataset.detail;
    const paceOrSpeed = this.workoutToEdit.querySelector(
      `#pacespeed .workout__value`
    );
    storedWorkout[editedValueName] = this.detailToEditValue.textContent =
      userInput;
    switch (storedWorkout.type) {
      case `running`:
        storedWorkout.getPace();
        paceOrSpeed.textContent = storedWorkout.pace;
        break;

      case `cycling`:
        storedWorkout.getSpeed();
        paceOrSpeed.textContent = storedWorkout.speed;
        break;
    }
  }
  _getStoredWorkout() {
    return this.workoutsArray.find(
      workout => workout.id === this.workoutToEdit.dataset.id
    );
  }
}

export default new EditView();
