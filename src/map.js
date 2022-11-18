class Map {
  map;
  userCoords;
  renderMap() {
    if (this._geopositionIsAvaiable()) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert(`Could not get your position`)
      );
    }
  }
  _geopositionIsAvaiable() {
    return navigator.geolocation;
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    this.userCoords = [latitude, longitude];
    //leaflet code
    this.map = L.map('map').setView(this.userCoords, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    this.map.on(`click`, this._renderFormAndSaveMapEvent.bind(this));

    this.workouts?.forEach(work => this._renderWorkoutMarker(work));
  }
}
export default new Map();
