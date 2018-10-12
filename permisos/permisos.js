
var m = 50,
    r = 200,
    z = d3.scale.category20c();

var pie = d3.layout.pie()
    .value(function (d) {
        return +d.count;
    })
    .sort(function (a, b) {
        return b.count - a.count;
    });

var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r);

d3.csv("data.csv", function (error, d) {
    if (error) throw error;

    var data = {}
    data.organismos = d3.nest()
        .key(function (d) {
            return d.entidad;
        })
        .entries(d);
    data.tipos = d3.nest()
        .key(function (d) {
            return d.proyecto;
        })
        .entries(d);

    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }

    var organismos = d3.select('#tabla-organismos');
    organismos.selectAll('li')
        .data(data.organismos)
        .enter()
        .append('li').append('a')
        .text(function (d) {
            return d.key
        })
        .on('click', function (d, i) {
            d3.select('#nombre').text("Nombre Proyecto")
            var valores = d3.select('#tabla-valores')
                .select('tbody')
            valores.selectAll('tr').remove()
            d.values.sort(function (a, b) {
                return b.count - a.count
            }).forEach(function (v) {
                if (v.count > 0){
                    var valor = valores.append('tr')
                    valor.append('td')
                        .text(v.proyecto)
                    valor.append('td')
                        .text(v.count)
                }
            })
            d3.select('#title').text(d.key);
            d3.select('#tabla-valores').select('tbody').selectAll('tr')
                .data(d.values)

            var disp = [data.organismos[i]]
            d3.select("#chart").selectAll("div").remove()
            var svg = d3.select("#chart").selectAll("div")
                .data(disp)
                .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r + m) * 2 + "px")
                .style("height", (r + m) * 2 + "px")
                .append("svg")
                .attr("width", (r + m) * 2)
                .attr("height", (r + m) * 2)
                .append("g")
                .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

            var g = svg.selectAll("g")
                .data(function (d) {
                    return pie(d.values);
                })
                .enter().append("g");

            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return z(d.data.proyecto);
                })
                .append("title")
                .text(function (d) {
                    return d.data.proyecto + ": " + d.data.count;
                });

            g.filter(function (d) {
                return d.endAngle - d.startAngle > .24;
            }).append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
                })
                .text(function (d) {
                    return d.data.proyecto;
                });


        })
    ;
    var tipos = d3.select('#tabla-tipos');
    tipos.selectAll('li')
        .data(data.tipos)
        .enter()
        .append('li').append('a')
        .text(function (d) {
            return d.key
        })
        .on('click', function (d, i) {
            d3.select('#nombre').text("Nombre Entidad")

            var valores = d3.select('#tabla-valores')
                .select('tbody')
            valores.selectAll('tr').remove()
            d.values.sort(function (a, b) {
                return b.count - a.count
            }).forEach(function (v) {
                if (v.count > 0){
                    var valor = valores.append('tr')
                    valor.append('td')
                        .text(v.entidad)
                    valor.append('td')
                        .text(v.count)
                }
            })

            d3.select('#title').text(d.key);
            var disp = [data.tipos[i]]
            d3.select("#chart").selectAll("div").remove()
            var svg = d3.select("#chart").selectAll("div")
                .data(disp)
                .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r + m) * 2 + "px")
                .style("height", (r + m) * 2 + "px")
                .append("svg")
                .attr("width", (r + m) * 2)
                .attr("height", (r + m) * 2)
                .append("g")
                .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

            var g = svg.selectAll("g")
                .data(function (d) {
                    return pie(d.values);
                })
                .enter().append("g");

            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return z(d.data.entidad);
                })
                .append("title")
                .text(function (d) {
                    return d.data.entidad + ": " + d.data.count;
                });

            g.filter(function (d) {
                return d.endAngle - d.startAngle > .2;
            }).append("text")
                .attr("dy", ".05em")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
                })
                .text(function (d) {
                    return d.data.entidad.slice(0, 24);
                });

        });
});

