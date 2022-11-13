import { View } from './View';

class EditView extends View {
  event;
  detailToEdit;
  workoutToEdit;
  targetDetailValue;
  handleEdits(e) {
    this.event = e;
    const clickedDetailData = openEditWindow.call(this, this.event);
    clickedDetailData.editInput.focus();
    submitEdit.call(this, clickedDetailData);
  }
  _openEditWindow() {
    if (!this.detailToEdit) return;
    if (this._isCalcuable(this.detailToEdit)) {
      this._showModal(`unchangeable`);
      return;
    }
  }
  _getDOMElements(e) {
    this.detailToEdit = e.target.closest(`.workout__details`);
    this.workoutToEdit = this.detailToEdit.closest(`.workout`);
    this.targetDetailValue = this.detailToEdit.closest(`.workout__value`);
  }
}
