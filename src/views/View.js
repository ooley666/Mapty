export class View {
  form = document.querySelector('.form');
  containerWorkouts = document.querySelector('.workouts');
  inputType = document.querySelector('.form__input--type');
  inputDistance = document.querySelector('.form__input--distance');
  inputDuration = document.querySelector('.form__input--duration');
  inputCadence = document.querySelector('.form__input--cadence');
  inputElevation = document.querySelector('.form__input--elevation');
  sortWrapper = document.querySelector(`.sort__wrapper`);
  deleteAll = document.querySelector(`.delete__all button`);
  overlay = document.querySelector(`.overlay`);
  modalText = document.querySelector(`.modal__text`);
  modalClose = document.querySelector(`.modal__close`);
  constructor() {
    this.modalClose.addEventListener(`click`, this.closeModal.bind(this));
  }
  showModal(context) {
    this.overlay.style.display = `flex`;
    if (context == 'emptyInput')
      this.modalText.textContent = 'please, input all data';
    if (context == 'invalidCharacter')
      this.modalText.textContent = 'you can only input positive numbers';
    if (context == 'unchangeable')
      this.modalText.textContent = 'you cannot change that';
  }
  closeModal(e) {
    e.preventDefault();
    console.log(this.overlay);
    this.overlay.style.display = `none`;
  }
}
