var data = [];
var max = undefined;
var n = 10

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

//     // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);
//
// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d) });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath") // this makes a mask the size of the graphic
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var path = svg.append("g")
.attr("clip-path", "url(#clip)")
.append("path")

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"));

svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));

nio.source.socketio(
 'http://brand.nioinstances.com',
 ['count_by_time'],
 120 // optional - will immediately stream cached data within the last 120 seconds
)
// .pipe(nio.log("before"))
.pipe(nio.filter(function(chunk) {
   return chunk.count_type === 'countpersec'
}))
.pipe(nio.pass(function(chunk){
  // console.log("My value is " + chunk.count_value);
  if (!max || chunk.count_value > max) {
    max = chunk.count_value
  }
  data.push(chunk.count_value)
    path
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    .transition()
      .duration(1000)
      .ease("linear")
      .attr("d", line)
      .each("end", chunk);
  if (data.length > n) {
  //   path
  //       // .attr("d", line)
  //       .attr("transform", null)
  //     .transition()
  //       .duration(1000)
  //       .ease("linear")
  //       .attr("transform", "translate(" + x(-1) + ",0)")
  //       .each("end", chunk);
    data.shift()
  }
  console.log(data);
  console.log(max);
}))
