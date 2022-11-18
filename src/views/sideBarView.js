import { View } from './View.js';
import { MONTHS } from '../config.js';
class SideBarView extends View {
  showUI() {
    this.sortWrapper.classList.remove(`hidden`);
    this.sortWrapper.style.display = `flex`;
    this.deleteAll.classList.remove(`hidden`);
  }
  hideUI() {
    this.sortWrapper.classList.add(`hidden`);
    this.sortWrapper.style.removeProperty(`display`);
    this.deleteAll.classList.add(`hidden`);
  }
  renderForm() {
    this.form.style.display = `grid`;
    this.form.classList.remove(`hidden`);
    this.inputDistance.focus();
  }
  hideForm() {
    this.inputDistance.value =
      this.inputCadence.value =
      this.inputDuration.value =
      this.inputElevation.value =
        ``;

    this.form.style.display = `none`;
    this.form.classList.add(`hidden`);
  }
  toggleCadenceOrElevation() {
    [
      this.inputCadence.closest(`.form__row`),
      this.inputElevation.closest(`.form__row`),
    ].forEach(el => el.classList.toggle(`form__row--hidden`));
  }
  renderWorkout(workout) {
    this.form.insertAdjacentHTML(`afterend`, this.createWorkoutHTML(workout));
  }
  createWorkoutHTML(workout) {
    const isRunning = workout => workout.type === `running`;
    return `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
          <h2 class="workout__title">${
            workout.type.slice(0, 1).toUpperCase() + workout.type.slice(1)
          }
            on ${MONTHS[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
           <div class ="delete__icon"> <img src ="trash_bin.png"  alt ="trash bin icon"></div>
          <div class="workout__details" data-detail="distance">
            <span class="workout__icon">${
              isRunning(workout) ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details" data-detail="duration">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details" id = "pacespeed" data-detail = "${
            isRunning(workout) ? 'pace' : 'speed'
          }">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              isRunning(workout) ? workout.pace : workout.speed
            }</span>
            <span class="workout__unit">${
              isRunning(workout) ? 'min/km' : 'km/h'
            }</span>
          </div>
          <div class="workout__details" data-detail="${
            isRunning(workout) ? 'cadence' : 'elevationGain'
          }">
            <span class="workout__icon">${
              isRunning(workout) ? '🦶🏼' : '⛰'
            }</span>
            <span class="workout__value">${
              isRunning(workout) ? workout.cadence : workout.elevationGain
            }</span>
            <span class="workout__unit">${
              isRunning(workout) ? 'spm' : 'm'
            }</span>
          </div>
        </li>`;
  }

  renderAllWorkouts(workoutsArr) {
    workoutsArr.forEach(workout => {
      workout.date = new Date(workout.date);
      this.renderWorkout(workout);
    });
  }
  removeAllWorkouts() {
    this.containerWorkouts
      .querySelectorAll(`.workout`)
      .forEach(work => work.parentNode.removeChild(work));
  }
  addFormSubmitHandler(handler) {
    this.form.addEventListener(`submit`, handler);
  }
  addTypeChangeHandler() {
    this.inputType.addEventListener(
      `change`,
      this.toggleCadenceOrElevation.bind(this)
    );
  }
  addMoveToMarkerHandler(handler) {
    this.containerWorkouts.addEventListener(`click`, handler);
  }
  addSortHandler(handler) {
    this.sortWrapper.addEventListener(`click`, handler);
  }
  addDeleteHandler(handler) {
    this.containerWorkouts.addEventListener(`click`, handler);
  }
  addAllDeleteHandler(handler) {
    this.deleteAll.addEventListener(`click`, handler);
  }
}

export default new SideBarView();
