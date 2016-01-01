var data = [];
var max = 0;
var n = 10
var step = 0

var margin = {top: 20, right: 20, bottom: 80, left: 80},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, n])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 90])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d) })
    .interpolate("monotone");

var reset = document.getElementById("reset")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var maxLine = svg.append('rect')
    .attr("class", "max")
    // .attr("transform", null)
    .attr("x", 0)
    .attr("y", y(0))
    .attr("width", width)
    .attr("height", 1)
    .attr("opacity", 0)

var maxLabel = svg.append("text")
    .attr("x", (width - margin.left) / 2)
    .attr("y",  y(max) - 18 )
    .style("text-anchor", "start")
    .attr("class", "maxLabel")
    .attr("opacity", 0);

svg.append("defs").append("clipPath") // this makes a mask the size of the graphic
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var path = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(n);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(n);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// text label for the x axis
svg.append("text")
    .attr("x", width/2 )
    .attr("y",  y(0) + margin.bottom/2 )
    .style("text-anchor", "middle")
    .text("seconds")
    .attr("class", "label");

// text label for the y axis
svg.append("text")
    .attr("x", x(0) - height/2 )
    .attr("y",  0 - margin.left/1.5)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("tweets per second")
    .attr("class", "label");

nio.source.socketio(
 'http://brand.nioinstances.com',
 ['count_by_network'],
 120 // optional - will immediately stream cached data within the last 120 seconds
)
.pipe(nio.filter(function(chunk) {
   return chunk.type === 'twitter'
}))
.pipe(nio.pass(function(chunk){
  if (!max || chunk.count_per_sec > max) { // fix this!!!
    max = chunk.count_per_sec
  }

  data.push(chunk.count_per_sec)
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

  maxLine.transition()
    // .delay(500)
    // .duration(500)
    .attr("opacity", function(){
      if (step < n) {
        step += 1
      }
      return step/(n*1.5);
    })
    .attr("y", y(max) - 2)

  maxLabel.transition()
    // .delay(500)
    // .duration(500)
    .attr("opacity", function(){
      if (step < n) {
        step += 1
      }
      return step/(n*1.5);
    })
    .attr("y", y(max) - 18 )
    .text("max: " + parseInt(max))


  if (data.length > n + 1) {

    reset.addEventListener('click', function(e) {
      max = d3.max(data)
    })

    path
        .attr("d", line) // redraw path immediately prior to the transition
        .attr("transform", null)
      .transition()
        .duration(860)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)") // then apply translate
        // .each("end", chunk);
    x = d3.scale.linear()
        .domain([0, n])
        .range([0, width]);
    console.log('ticks array? ', x.ticks());
    svg.selectAll(".x.axis")
        .call(xAxis) // redraw path immediately prior to the transition
        // .attr("transform", "translate(2,"+ y(0)+")") // then apply translate
      .transition()
        .duration(860)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ","+ y(0)+")") // then apply translate

    data.shift()
    // x = d3.scale.linear()
    //     .domain([0, n])
    //     .range([0, width]);
    svg.selectAll(".x.axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(xAxis)
  }


  console.log(data);
  console.log(max);
}))
