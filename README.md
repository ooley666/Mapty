# Mapty App

https://mapty-by-ooley.surge.sh/

An app for trackin your running/cycling activities with an integrated map by Leaflet.

##Summary

One of the practical tasks from _"The Complete JavaScript Course"_ by Jonas Schmedtmann. Development period: July/August 2022. This project helped me understand OOP principles as well as practice using APIs (Geolocation and Leaflet).

Using MVC structire wasn`t the task, I just decided to practice refactoring on my own later, when I finished the key functionality.

---

##Use
**First of all allow the page to use your geolocation. Otherwise, it wouldn`t work.**

To start, click on a map. You will see a form rendered in the sidebar. Enter the data or change the workout type, if you want to add a cycling workout instead of running.

As you submit the form, a marker will be rendered on the map and the whole workout history will be created/updated in your local storage.

Any workout can be edited or deleted. To edit, click on the needed detail on the workout tile, enter the new data and hit _Enter_.
To delete a workout, simply click the trashcan icon. You can also delete all workouts.

After adding several workouts, try sorting them by distance/time/date. The controls are at the top, right under the logo.

##Future updates

I plan on rebuilding the project with React and Typescript.
