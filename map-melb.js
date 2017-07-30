(function() {
  var width = 800,
      height = 500;

  var t1 = textures.circles()
  .size(10)
  .radius(1).fill("darkorange")
      .background("#343434")
  var t2 = textures.circles()
  .size(8)
  .radius(1.5).fill("darkorange")
  .background("#343434")
  var t3 = textures.circles()
  .size(7.5)
  .radius(2).fill("darkorange")
  .background("#343434")
  var t4 = textures.circles()
    .size(5)
    .radius(2.5)
    .fill("darkorange")
    .background("#343434");


  var svg = d3.select(".map-4").append("svg")
      .attr("id", "map-4")
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

  getPattern = function(pattern) {
    var m = child[pattern.properties.SA3_CODE11]
    //console.log(m)
    if (m > 12.5) {
      return t4.url();
    }
    if (m > 10) {
      return t3.url();
    }
    if (m > 8) {
      return t2.url();
    }
    else {
      return t1.url();
    }
    return t1.url();
  };

  d3.csv("./child.csv", function(data) {
    child = {}
    for (var i = 0; i < data.length; i += 1) {
      child[data[i].SA3_code_2011] = parseFloat(data[i].fee_hr_mean.replace("$",""))
    }
  });

  d3.json("./sa3.json", function(error, it) {

    console.log(it)
    var center = [144.96, -37.81]//d3.geo.centroid(it)
    var scale  = 50000;
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
//console.log(it.features)
      var path = d3.geo.path()
          .projection(projection);


          var tooltip = d3.select('body').append('div')
                      .attr('class', 'hidden tooltip');


      // draw and style any feature at time
      svg.selectAll("path")
          .data(it.features)
          .enter().append("path")
          //.attr("class","prov")
          .attr("class", function(d) { return "prov2 " + d.id; })
          .style("fill", function(d) { return getPattern(d); })
          .on('mouseover', function(d){
              var nodeSelection = d3.select(this).style("fill", function(de) {
                //console.log(de)
                d3.select("#melb").html(de.properties.SA3_NAME11 + "(" + de.properties.SA3_CODE11 + ") - $" +
              child[de.properties.SA3_CODE11])
                 return 'darkorange'; })
              //nodeSelection.select("text").style({opacity:'1.0'});
          })
          .on('mouseout', function(d){
              var nodeSelection = d3.select(this).style("fill", function(de) {
                d3.select("#melb").html("-")

                //console.log(d3.geo.centroid(de))
                 return getPattern(de); })
              //nodeSelection.select("text").style({opacity:'1.0'});
          })
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
