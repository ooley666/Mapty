import { Running } from './workoutClasses.js';
import { Cycling } from './workoutClasses.js';

export function setLocalStorage(workoutsArray) {
  localStorage.setItem(`workouts`, JSON.stringify(workoutsArray));
}
export function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem(`workouts`));
  if (!data) return [];
  //restoring objects inheritance
  return data.map(work => {
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
}
