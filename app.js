var data = [];
var max = undefined;
var n = 11

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
    .y(function(d, i) { return y(d) })
    .interpolate("monotone");

// var maxLine = d3.svg.line()
//   .x( x(100) )
//   .y(y(max))

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
.pipe(nio.filter(function(chunk) {
   return chunk.count_type === 'countpersec'
}))
.pipe(nio.pass(function(chunk){
  // console.log("My value is " + chunk.count_value);
  if (!max || chunk.count_value > max) {
    max = chunk.count_value
  }
  data.push(chunk.count_value)
  path.datum(data)
    // .attr("d", line)
    // .transition()
    //   // .delay(10)
    //   .duration(1400)
      .attr("class", "line")

    // .transition()
    //   .duration(800)
    //   .attrTween('d', pathTween)
    //   .ease("linear")
      .attr("d", line)

// function pathTween() {
//     var interpolate = d3.scale.quantile()
//             .domain([0,1])
//             .range(d3.range(1, data.length + 1));
//     return function(t) {
//         return line(data.slice(0, interpolate(t)));
//     };
// }
  // path
  //   .attr('class', 'line')
  //   .attr('d', maxLine)

  svg
    .append('rect')
    .attr("class", "max")
    .attr("transform", null)
    .attr("x", 0)
    .attr("y", y(max) - 2)
  // .transition()
    // .delay(500)
    .attr("width", width)
    .attr("height", 1)
    // .attr("transform", "translate(0," + y(max + 1) + ")")


  if (data.length > n) {
    path
        .attr("d", line) // redraw path immediately prior to the transition
        .attr("transform", null)
      .transition()
        .duration(860)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)") // then a translate is applied
        // .each("end", chunk);
    data.shift()
  }

  console.log(data);
  console.log(max);
}))
