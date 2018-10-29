var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>Permisos únicos:</strong> <span style='color:red'>" + d.frequency + "</span>";
    })

var svg1 = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var svg2 = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom +70)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var svg3 = d3.select("#chart3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg1.call(tip);

var datas = [
    {
        name: "Todos",
        data: [
            {letter: 'Recepción Final Obras de Edificación', frequency: 16},
            {letter: 'Permiso de Edificación', frequency: 6},
            {letter: 'Resolución de Calificación Ambiental', frequency: 4},
            {letter: 'Permiso de Demolición', frequency: 4},
            {letter: 'Decreto Presupuestario', frequency: 4}]
    },
    {
        name: "Energía",
        data: [
            {letter: 'Resolución de Calificación Ambiental', frequency: 51},
            {letter: 'Estudio de impacto sobre Sistema de Transporte Urbano (EISTU)', frequency: 10},
            {letter: 'Constitución Derecho de Aprovechamiento de Aguas', frequency: 9},
            {letter: 'Permiso de edificación ', frequency: 5},
            {letter: 'Declaración y Seguimiento de Residuos Peligrosos.', frequency: 5}]
    },
    {
        name: "Industrias",
        data: [
            {letter: 'SEREMI DE SALUD	', frequency: 86},
            {letter: 'SERNAGEOMIN', frequency: 26},
            {letter: 'DOM', frequency: 23},
            {letter: 'DGA', frequency: 19},
            {letter: 'CONAF', frequency: 17},
            {letter: 'SEC', frequency: 17}]
    }
];

draw(datas[0], svg1, "Requisitos");
draw(datas[1], svg2 ,"Permisos");
draw(datas[2], svg3, "Permisos");

function type(d) {
    d.frequency = +d.frequency;
    return d;
}

function draw(d, s , t) {

    var data = d.data
    x.domain(data.map(function (d) {
        return d.letter;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);
    s.selectAll('g').remove()
    s.selectAll('.bar').remove()
    s.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")

        .call(xAxis);

    s.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(t);

    s.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.letter);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.frequency);
        })
        .attr("height", function (d) {
            return height - y(d.frequency);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    s.selectAll("text").call(wrap, 180)
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}