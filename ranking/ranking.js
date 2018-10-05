var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
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

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var datas = [
    {
        name: "Total",
        data: [
            {letter: 'Energía', frequency: 478},
            {letter: 'Industrias', frequency: 872},
            {letter: 'Infraestructura', frequency: 447},
            {letter: 'Inmobiliario', frequency: 133},
            {letter: 'Minería', frequency: 204}]
    },
    {
        name: "Energía",
        data: [
            {letter: 'Hidro', frequency: 158},
            {letter: 'ERNC', frequency: 171},
            {letter: 'Transmisión', frequency: 149}]
    },
    {
        name: "Industrias",
        data: [
            {letter: 'Agroindustrias	', frequency: 127},
            {letter: 'Aguas servidas	', frequency: 148},
            {letter: 'Planta desaladora	', frequency: 134},
            {letter: 'Químicos	', frequency: 160},
            {letter: 'Acuícola	', frequency: 142},
            {letter: 'Celulosa	', frequency: 161}]
    },
    {
        name: "Infraestructura",
        data: [

            {letter: 'Vialidad', frequency: 149},
            {letter: 'Hospitales', frequency: 180},
            {letter: 'Metro', frequency: 118}]
    },
    {
        name: "Inmobiliario",
        data: [
            {letter: 'Residencial', frequency: 133}]
    },
    {
        name: "Minería",
        data: [
            {letter: 'Explotación', frequency: 204}]
    }
];

draw(datas[0]);
function type(d) {
    d.frequency = +d.frequency;
    return d;
}

var tipos = d3.select('#table');
tipos.selectAll('button')
    .data(datas)
    .enter()
    .append('button').attr('class', 'btn btn-outline-info')
    .on('click', function (d) {
        draw(d)
    })
    .text(function (d) {
        return d.name
    });

function draw(d) {
    {
        d3.select('#title').text(d.name);
        var data = d.data
        x.domain(data.map(function (d) {
            return d.letter;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.frequency;
        })]);
        svg.selectAll('g').remove()
        svg.selectAll('.bar').remove()
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Permisos");

        svg.selectAll(".bar")
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


    }
}