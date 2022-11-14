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

export class Running extends Workout {
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
export class Cycling extends Workout {
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
