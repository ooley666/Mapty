'use strict';
import * as storage from './localStorage.js';
import { Running, Cycling } from './workoutClasses.js';
import editView from './views/editView.js';
import sideBarView from './views/sideBarView.js';
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

class App {
  #map;
  #mapEvent;
  workouts = [];
  #markers = [];
  //fire as the page loads
  constructor() {
    //get user's position
    this._getPosition();

    this._init();
    //EVENT HANDLERS
    form.addEventListener(`submit`, this._newWorkout.bind(this));
    inputType.addEventListener(`change`, sideBarView.toggleCadenceOrElevation);
    containerWorkouts.addEventListener(
      `click`,
      function (e) {
        editView.handleEdits(e, this.workouts);
      }.bind(this)
    );

    containerWorkouts.addEventListener(`click`, this._MoveToMarker.bind(this));
    sortWrapper.addEventListener(`click`, this._sortWorkouts.bind(this));
    containerWorkouts.addEventListener(`click`, this._deleteHandler.bind(this));
    deleteAll.addEventListener(`click`, this._deleteAllWorkouts.bind(this));
  }

  _init() {
    this.workouts = storage.getLocalStorage();
    if (this.workouts.length < 1) return;
    sideBarView.renderAllWorkouts(this.workouts);
    //showing UI elements if there are workouts
    sideBarView.showUI();
  }

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
    this.#map.on(`click`, this._renderFormAndSaveMapEvent.bind(this));

    this.workouts?.forEach(work => this._renderWorkoutMarker(work));
  }
  ////MAP CLASS
  ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //ARE IN THE vIEW CLASS
  //callback for map EvList
  _renderFormAndSaveMapEvent(mapE) {
    this.#mapEvent = mapE;
    sideBarView.renderForm();
  }

  _sortWorkouts(e) {
    //choosing clicked element
    const clicked = e.target.closest(`.sort__element`);
    if (!clicked) return;

    const type = clicked.dataset.type;
    //sorting by date
    if (type === `date`) {
      sideBarView.removeAllWorkouts();
      //this should be the original array, cause it is already sorted chronologically
      sideBarView.renderAllWorkouts(this.workouts);
      return;
    }
    //copying workouts
    const workoutsCopy = this.workouts.slice();
    workoutsCopy.sort((a, b) => a[type] - b[type]);
    //updating UI
    sideBarView.removeAllWorkouts();
    sideBarView.renderAllWorkouts(workoutsCopy);
  }

  //displaying workout list

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
      sideBarView.hideUI();
      return;
    }
    //updating local storage after removing deleted workout
    storage.setLocalStorage(this.workouts);
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
    sideBarView.removeAllWorkouts();
    sideBarView.hideUI();
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
      return sideBarView.showModal('emptyInput');
    //////////////
    if (type == `running`) {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return sideBarView.showModal('invalidCharacter');
      workout = new Running(distance, duration, [lat, lng], cadence);
    }
    //////////////
    if (type == `cycling`) {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return sideBarView.showModal('invalidCharacter');
      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }
    if (this.workouts.includes(workout)) {
      return workout;
    }
    this.workouts.push(workout);
    this._renderWorkoutMarker(workout);
    sideBarView.hideForm();
    sideBarView.renderWorkout(workout);
    sideBarView.showUI();
    //Set local storage for all the workouts
    // console.log(workout);
    // console.log(this.workouts);
    // console.log(this.#markers);
    storage.setLocalStorage(this.workouts);
  }
}

const app = new App();
