(function() {
  var width = 800,
      height = 500;

  var t1 = textures.lines().orientation("vertical").thicker().lighter();
  var t2 = textures.circles().complement().thicker().lighter();
  var t3 = textures.lines().size(4).strokeWidth(2);
  var t4 = textures.circles()
    .size(10)
    .radius(2)
    .fill("white")
    .background("#343434");


  var svg = d3.select(".map-1").append("svg")
      .attr("id", "map-1")
      .attr("class", "map")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 660 500")          // make it
      .attr("preserveAspectRatio", "xMidYMid") // responsive

  svg.call(t1.thicker());
  svg.call(t2);
  svg.call(t3);
  svg.call(t4);
  var getPattern;

  getPattern = function(province) {
    var m = Math.random() * 4
    if (m > 3) {
      return t4.url();
    }
    if (m > 2) {
      return t3.url();
    }
    if (m > 1) {
      return t2.url();
    }
    else {
      return t1.url();
    }
    return t1.url();
  };

  d3.json("./sa3.json", function(error, it) {


    var center = d3.geo.centroid(it)
    var scale  = 650;
    var offset = [(width/2)-50, height/2];
    var projection = d3.geo.mercator().scale(scale).center(center)
        .translate(offset);
      //var projection = d3.geo.mercator()
      //.scale(1000)
      //.center([33.8,151,2])
      //.translate([-2600, -300])
      //.scale(width / 2 / Math.PI * 10)
      //.scale(100)

        //  .center([0, 40])
        //  .rotate([347, 0])
        //  .parallels([35, 45])
        //  .scale(1)
        //  .translate([width / 2, height / 2]);

      //var subunits = topojson.feature(it, it.objects.sub);

      var path = d3.geo.path()
          .projection(projection);

      // draw and style any feature at time
      svg.selectAll("path")
          .data(it.features)
          .enter().append("path")
          //.attr("class","prov")
          .attr("class", function(d) { return "prov " + d.id; })
          .style("fill", function(d) { return getPattern(d.id); })
          .attr("d",path);

      // draw all the features together (no different styles)
      svg.append("path")
          .datum(it.features)
          .attr("class", "map")
          .attr("d", path)

      d3.select(".map-section").transition().duration(1500).style("opacity",1);
      d3.select(".subtitle").transition().delay(500).duration(1000).style("opacity",1);
      d3.select(".github").transition().delay(800).duration(1000).style("opacity",1);

  })

})()
