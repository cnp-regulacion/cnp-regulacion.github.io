// Define the margin, radius, and color scale. Colors are assigned lazily, so
// if you want deterministic behavior, define a domain for the color scale.
var m = 50,
    r = 200,
    z = d3.scale.category20c();

// Define a pie layout: the pie angle encodes the count of flights. Since our
// data is stored in CSV, the counts are strings which we coerce to numbers.
var pie = d3.layout.pie()
    .value(function (d) {
        return +d.count;
    })
    .sort(function (a, b) {
        return b.count - a.count;
    });

// Define an arc generator. Note the radius is specified here, not the layout.
var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

// Load the flight data asynchronously.
d3.csv("flights.csv", function (error, flights) {
    if (error) throw error;

    // Nest the flight data by originating airport. Our data has the counts per
    // airport and carrier, but we want to group counts by aiport.
    var airports = d3.nest()
        .key(function (d) {
            return d.origin;
        })
        .entries(flights);
    var data = {}
    data.organismos = d3.nest()
        .key(function (d) {
            return d.origin;
        })
        .entries(flights);
    data.tipos = d3.nest()
        .key(function (d) {
            return d.carrier;
        })
        .entries(flights);
    console.log(data.tipos)
    // Insert an svg element (with margin) for each airport in our dataset. A
    // child g element translates the origin to the pie center.

    // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }

    var organismos = d3.select('#tabla-organismos');
    organismos.selectAll('tr')
        .data(data.organismos)
        .enter()
        .append('tr')
        .on('click', function (d,i) {
            d3.select('#title').text(d.key);
            d3.select('#tabla-valores').select('tbody').selectAll('tr')
                .data(d.values)

            var disp = [data.organismos[i]]
            d3.select("#chart").selectAll("div").remove()
            var svg = d3.select("#chart").selectAll("div")
                .data(disp)
                .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
                .style("display", "inline-block")
                .style("width", (r + m) * 2 + "px")
                .style("height", (r + m) * 2 + "px")
                .append("svg")
                .attr("width", (r + m) * 2)
                .attr("height", (r + m) * 2)
                .append("g")
                .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

            // Pass the nested per-airport values to the pie layout. The layout computes
            // the angles for each arc. Another g element will hold the arc and its label.
            var g = svg.selectAll("g")
                .data(function (d) {
                    return pie(d.values);
                })
                .enter().append("g");

            // Add a colored arc path, with a mouseover title showing the count.
            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return z(d.data.carrier);
                })
                .append("title")
                .text(function (d) {
                    return d.data.carrier + ": " + d.data.count;
                });

            // Add a label to the larger arcs, translated to the arc centroid and rotated.
            g.filter(function (d) {
                return d.endAngle - d.startAngle > .2;
            }).append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
                })
                .text(function (d) {
                    return d.data.carrier;
                });




        })
        .append('a')
        .attr('href', '#')
        .text(function (d) {
            return d.key
        })
        ;
    var tipos = d3.select('#tabla-tipos');
    tipos.selectAll('tr')
        .data(data.tipos)
        .enter()
        .append('tr')
        .on('click', function (d,i) {
            d3.select('#title').text(d.key);
            var disp = [data.tipos[i]]
            d3.select("#chart").selectAll("div").remove()
            var svg = d3.select("#chart").selectAll("div")
                .data(disp)
                .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
                .style("display", "inline-block")
                .style("width", (r + m) * 2 + "px")
                .style("height", (r + m) * 2 + "px")
                .append("svg")
                .attr("width", (r + m) * 2)
                .attr("height", (r + m) * 2)
                .append("g")
                .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

            // Pass the nested per-airport values to the pie layout. The layout computes
            // the angles for each arc. Another g element will hold the arc and its label.
            var g = svg.selectAll("g")
                .data(function (d) {
                    return pie(d.values);
                })
                .enter().append("g");

            // Add a colored arc path, with a mouseover title showing the count.
            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return z(d.data.origin);
                })
                .append("title")
                .text(function (d) {
                    return d.data.origin + ": " + d.data.count;
                });

            // Add a label to the larger arcs, translated to the arc centroid and rotated.
            g.filter(function (d) {
                return d.endAngle - d.startAngle > .2;
            }).append("text")
                .attr("dy", ".05em")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
                })
                .text(function (d) {

                    return d.data.origin.slice(0,20);
                });

        })
        .append('a')
        .attr('href', '#')
        .text(function (d) {
            return d.key
        });
});

