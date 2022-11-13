'use strict';
import { handleEdits } from './editView.js';
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sortWrapper = document.querySelector(`.sort__wrapper`);
const deleteAll = document.querySelector(`.delete__all button`);
const overlay = document.querySelector(`.overlay`);
const modalText = document.querySelector(`.modal__text`);
const modalClose = document.querySelector(`.modal__close`);

class App {
  #map;
  #mapEvent;
  workouts = [];
  #markers = [];
  //fire as the page loads
  constructor() {
    //get user's position
    this._getPosition();

    //get data from local storage
    this._getLocalStorage();
    // console.log(this.workouts);
    //EVENT HANDLERS
    form.addEventListener(`submit`, this._newWorkout.bind(this));
    inputType.addEventListener(`change`, this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener(`click`, handleEdits.bind(this));
    containerWorkouts.addEventListener(`click`, this._MoveToMarker.bind(this));
    sortWrapper.addEventListener(`click`, this._sortWorkouts.bind(this));
    containerWorkouts.addEventListener(`click`, this._deleteHandler.bind(this));
    deleteAll.addEventListener(`click`, this._deleteAllWorkouts.bind(this));
    modalClose.addEventListener(`click`, this._closeModal.bind(this));
  }

  _setLocalStorage() {
    localStorage.setItem(`workouts`, JSON.stringify(this.workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem(`workouts`));
    if (!data) return;
    //restoring objects inheritance
    this.workouts = data.map(work => {
      if (work.type === `running`) {
        return new Running(
          work.distance,
          work.duration,
          work.coords,
          work.cadence,
          new Date(work.date),
          work.id
        );
      }
      if (work.type === `cycling`) {
        return new Cycling(
          work.distance,
          work.duration,
          work.coords,
          work.elevationGain,
          new Date(work.date),
          work.id
        );
      }
    });
    this._renderAllWorkouts(this.workouts);
    //showing UI elements if there are workouts
    this._showUI();
    console.log(this.workouts);
  }
  //ARE IN THE vIEW CLASS
  //////////////////////////////
  _showUI() {
    sortWrapper.classList.remove(`hidden`);
    sortWrapper.style.display = `flex`;
    deleteAll.classList.remove(`hidden`);
  }
  _hideUI() {
    sortWrapper.classList.add(`hidden`);
    sortWrapper.style.removeProperty(`display`);
    deleteAll.classList.add(`hidden`);
  }
  //ARE IN THE vIEW CLASS
  ////////////////////////////////////
  //rebuilding cycling and running objects from local storage
  /////////////////////////////////////////////
  ////MAP CLASS
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert(`Could not get your position`)
      );
    }
  }

  //renders the map and adds an event listener to it
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    //leaflet code
    this.#map = L.map('map').setView(coords, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on(`click`, this._showForm.bind(this));

    this.workouts.forEach(work => this._renderWorkoutMarker(work));
  }
  ////MAP CLASS
  ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //ARE IN THE vIEW CLASS

  _showModal(context) {
    overlay.style.display = `flex`;
    if (context == 'emptyInput')
      modalText.textContent = 'please, input all data';
    if (context == 'invalidCharacter')
      modalText.textContent = 'you can only input positive numbers';
    if (context == 'unchangeable')
      modalText.textContent = 'you cannot change that';
  }
  _closeModal(e) {
    e.preventDefault();
    overlay.style.display = `none`;
    console.log(e.key);
  }
  //callback for map EvList
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.style.display = `grid`;
    form.classList.remove(`hidden`);
    inputDistance.focus();
  }
  //clearing and hiding the form
  _closeForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        ``;

    form.style.display = `none`;
    form.classList.add(`hidden`);
    // setTimeout(() => {
    //   form.style.display = `grid`;
    // }, 1000);
  }

  _toggleElevationField() {
    [
      inputCadence.closest(`.form__row`),
      inputElevation.closest(`.form__row`),
    ].forEach(el => el.classList.toggle(`form__row--hidden`));
    console.log(this.#map);
  }
  _sortWorkouts(e) {
    //choosing clicked element
    const clicked = e.target.closest(`.sort__element`);
    if (!clicked) return;

    const type = clicked.dataset.type;
    //sorting by date
    if (type === `date`) {
      this._removeAllWorkouts();
      //this should be the original array, cause it is already sorted chronologically
      this._renderAllWorkouts(this.workouts);
      return;
    }
    //copying workouts
    const workoutsCopy = this.workouts.slice();
    workoutsCopy.sort((a, b) => a[type] - b[type]);
    //updating UI
    this._removeAllWorkouts();
    this._renderAllWorkouts(workoutsCopy);
  }
  _removeAllWorkouts() {
    containerWorkouts
      .querySelectorAll(`.workout`)
      .forEach(work => work.parentNode.removeChild(work));
  }
  _renderAllWorkouts(workoutsArr) {
    workoutsArr.forEach(workout => {
      workout.date = new Date(workout.date);
      this._renderWorkout(workout);
    });
  }
  //displaying workout list
  _renderWorkout(workout) {
    const isRunning = workout => workout.type === `running`;
    const html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
          <h2 class="workout__title">${
            workout.type.slice(0, 1).toUpperCase() + workout.type.slice(1)
          }
            on ${months[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
           <div class ="delete__icon"> <img src ="img/trash_bin.png"  alt ="trash bin icon"></div>
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

    form.insertAdjacentHTML(`afterend`, html);
  }
  //ARE IN THE vIEW CLASS
  // /////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  ///aRE IN THE MAP CLASS
  //displaying marker
  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === `running` ? '🏃‍♂️' : '🚴‍♀️'} ${
          workout.type.slice(0, 1).toUpperCase() + workout.type.slice(1)
        } on ${months[workout.date.getMonth()]} ${workout.date.getDate()}`
      )
      .openPopup();
    this.#markers.push(marker);
  }

  _MoveToMarker(e) {
    const clicked = e.target.closest(`.workout`);
    if (!clicked) return;
    const clickedObj = this.workouts.find(
      workout => workout.id === clicked.dataset.id
    );
    const coords = clickedObj.coords;
    this.#map.flyTo(coords, 14);
  }
  _deleteHandler(e) {
    // check for button to be clicked
    const clickedButton = e.target.closest(`.delete__icon`);
    if (!clickedButton) return;
    //finding clicked workout in the workouts array
    const clickedWorkout = clickedButton.closest(`.workout`);
    const clickedObjIndex = this.workouts.findIndex(
      workout => workout.id === clickedWorkout.dataset.id
    );
    this._deleteWorkout(clickedObjIndex);
    //removing workout tab from the DOM
    containerWorkouts.removeChild(clickedWorkout);
    if (this.workouts.length === 0) {
      localStorage.clear();
      this._hideUI();
      return;
    }
    //updating local storage after removing deleted workout
    this._setLocalStorage();
  }
  _deleteWorkout(workoutObjIndex) {
    const [deletedObj] = this.workouts.splice(workoutObjIndex, 1);
    //finding marker in the markers array and removing it from the map (it has inherited method `remove`)
    this.#markers[workoutObjIndex].remove();
    //removing marker from the markers array
    this.#markers.splice(workoutObjIndex, 1);
  }
  _deleteAllWorkouts() {
    this.workouts = [];
    this.#markers.forEach(marker => marker.remove());
    this.#markers = [];
    this._removeAllWorkouts();
    this._hideUI();
    localStorage.clear();
  }
  _newWorkout(e) {
    //checking for valid inputs (positive numbers)
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    let workout;
    //choosing between r and c

    if (inputDistance.value == `` || inputDuration.value == ``)
      return this._showModal('emptyInput');
    //////////////
    if (type == `running`) {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return this._showModal('invalidCharacter');
      workout = new Running(distance, duration, [lat, lng], cadence);
    }
    //////////////
    if (type == `cycling`) {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return this._showModal('invalidCharacter');
      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }
    if (this.workouts.includes(workout)) {
      return workout;
    }
    this.workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._closeForm();
    this._renderWorkout(workout);
    this._showUI();
    //Set local storage for all the workouts
    // console.log(workout);
    // console.log(this.workouts);
    // console.log(this.#markers);
    this._setLocalStorage();
  }
}

class Workout {
  date = new Date();
  id = Date.now() + ``;
  constructor(
    distance,
    duration,
    coords,
    date = new Date(),
    id = Date.now() + ``
  ) {
    this.distance = distance; //km
    this.duration = duration; //min
    this.coords = coords; //[lat,lng]
    this.date = date;
    this.id = id;
  }
}

class Running extends Workout {
  type = `running`;
  constructor(distance, duration, coords, cadence, _date, _id) {
    super(distance, duration, coords, _date, _id);
    this.cadence = cadence;
    this.getPace();
  }

  getPace() {
    this.pace = (this.duration / this.distance).toFixed(1);
    return this.pace;
  }
}
class Cycling extends Workout {
  type = `cycling`;
  constructor(distance, duration, coords, elevationGain, _date, _id) {
    super(distance, duration, coords, _date, _id);
    this.elevationGain = elevationGain;
    this.getSpeed();
  }
  getSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    return this.speed;
  }
}

const app = new App();
