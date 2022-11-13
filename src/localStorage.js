export function setLocalStorage(workoutsArray) {
  localStorage.setItem(`workouts`, JSON.stringify(workoutsArray));
}
