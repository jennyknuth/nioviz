## How many tweets?

A simple real-time app using a stream of data from [nio.js](https://github.com/nioinnovation/nio.js) and visualized using [D3.js](http://d3js.org/).

Shows the number of tweets per second and the maximum number of tweets per second 
for the interval between refreshing or clicking the reset button. 

Simple directory with index.html, style.css, and app.js. Open index.html to run, or see it live here:

Some ideas for future functionality (a wish list): 
  - smooth out initial line drawing to make path segments animatable
  - smooth out line drawing transitions by setting duration to equal the previous time to update data (assuming the best judge of time to get data is the time it most recently took)
  - add a counter for interval between resets
  - all kinds of statistics are possible: records, streaks, averages, calendars
  - add more interactivity to line to show values more clearly on hover

