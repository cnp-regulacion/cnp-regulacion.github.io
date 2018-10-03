var data;

var boxWidth = 200,
    boxHeight = 100,
    height = 1000,
    width = 2000,
    separation = 40;

// Setup zoom and pan
var zoom = d3.behavior.zoom()
    .scaleExtent([.1, 30000])
    .on('zoom', function () {
        chart.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    })
// Offset so that first pan and zoom does not jump back to the origin
//.translate([150, 200]);

var svg = d3.select("#mapa").append("svg")
    .attr('width', 2000)
    .attr('height', 1000)
    .call(zoom)

var chart = svg.append('g');


var flechas = chart.append('g').attr("class", "flechas")
var actividades = chart.append('g').attr("class", "nodos")
var barra_superior = chart.append('g').attr("class", "barra-superior");
var barra_lateral = chart.append('g').attr("class", "barra-lateral");
var tooltip = chart.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function dibujarLayout(matriz) {
    barra_superior.selectAll(".etapa-linea")
        .data(matriz.etapas)
        .enter()
        .append("path")
        .attr('class', 'etapa-linea')
        .attr("d", function (d, i) {
            return "M " + (165 + d.finish * (boxWidth + separation)) + " 0 l 20 20 l -20 20 V" + (160 + matriz.organismos.slice(-1)[0].finish * (boxHeight + separation));
        })
        .attr("stroke-dasharray", "30 10")
        .attr("fill", "none")
    barra_superior.selectAll(".etapa-nombre")
        .data(matriz.etapas)
        .enter()
        .append("text")
        .attr('class', 'etapa-nombre')
        .attr('dx', function (d) {
            return 90 + ((d.start + d.finish) / 2) * (boxWidth + separation)
        })
        .attr('dy', 20)
        .text(function (d, i) {
            return d.text
        })
        .attr("text-anchor", "middle")
    barra_lateral.selectAll(".organismo-linea")
        .data(matriz.organismos)
        .enter()
        .append("path")
        .attr('class', 'organismo-linea')
        .attr("d", function (d, i) {
            return "M 0 " + (160 + d.finish * (boxHeight + separation)) + " H" + (180 + matriz.etapas.slice(-1)[0].finish * (boxWidth + separation))
        })
    barra_lateral.selectAll(".organismo-nombre")
        .data(matriz.organismos)
        .enter()
        .append("text")
        .attr('class', 'organismo-nombre')
        .attr('dy', function (d) {
            return (100 + (((d.start + d.finish) / 2) * (boxHeight + separation)))
        })
        .attr('dx', 20)
        .attr('transform', function (d) {
            return "rotate(-90," + 20 + " " + (100 + (((d.start + d.finish) / 2) * (boxHeight + separation))) + ")"
        })
        .text(function (d, i) {
            return d.text
        })
        .attr("text-anchor", "middle")

    barra_superior.append("path")
        .attr('class', 'etapa-linea')
        .attr("d", "M 40 40 V" + (160 + matriz.organismos.slice(-1)[0].finish * (boxHeight + separation)))
    barra_lateral.append("path")
        .attr('class', 'organismo-linea')
        .attr("d", "M 40 40 H" + (180 + matriz.etapas.slice(-1)[0].finish * (boxWidth + separation)))

}

/*
var figuras = svg.append('g').attr("class", "figuras")

figuras.append('path')
    .attr("class", "rombo")
    .attr('d', 'M 80 80 l 20 20 l -20 20 l -20 -20 Z')
figuras.append('path')
    .attr("class", "rombo")
    .attr('d', 'M 120 80 l 20 20 l -20 20 l -20 -20 Z m 0 10 v 20 v -10 h 10 h -20')*/


d3.json('nodes.json', function (error, json) {

    if (error) {
        return console.error(error);
    }

    data = json;
    var nodos = inicializarNodos(JSON.parse(JSON.stringify(data.nodos)))
    nodos = mostrarNodos(nodos, data.grupos)
    procesarProfundidad(nodos)
    ordenarProfundidad(nodos)
    var etapas = ordenarEtapas(data.etapas, nodos)
    var matriz = crearMatriz(etapas, data.etapas, data.organismos)
    dibujarNodos(matriz)
    dibujarFlechas(matriz)
    dibujarLayout(matriz)
    d3.selectAll(".name").each(function (d, i) {
        d3plus.textwrap()
            .container(d3.select(this))
            .valign("middle")
            .align("center")
            .draw();
    });

});

function inicializarNodos(nodes) {
    var res = nodes
    for (var i = 0; i < res.length; i++) {
        var node = res[i];
        node.id = i;
        if (node.tipo == "normal" && node.flechas.length > 1) {
            res.push({
                "tipo": "paralelo",
                "texto": "",
                "etapa": node.etapa,
                "organismo": node.organismo,
                "info": "fgerheshrseh",
                "enlace": "fhszrea",
                "flechas": node.flechas,
                "profundidad": 0,
                "ley": ""
            })
            node.flechas = [res.length - 1]
        }


    }
    return res
}

function mostrarNodos(nodos, grupos) {
    var res = []
    var mostrargrupos = []
    grupos.forEach(function (g) {
        if (g.mostrar) {
            g.critico = false;
            mostrargrupos.push(g)
            g.nodos.forEach(function (n) {
                var naux = nodos.find(function (n2) {
                    return n2.id === n;
                });
                if (naux.critico) g.critico = true;
            })

        }
    })
    nodos.forEach(function (n) {
        var mostrar = true;
        mostrargrupos.forEach(function (g) {
            if (g.nodos.includes(n.id)) {
                mostrar = false;
                addNodes(n.flechas, g)
            }
            n.flechas.forEach(function (f, index) {
                if (g.nodos.includes(f)) n.flechas[index] = g.id
            })

        })
        if (mostrar) res.push(n)
    })

    return res.concat(mostrargrupos);
}

function addNodes(nodes, g) {
    nodes.forEach(function (n) {
        if (!g.nodos.includes(n)) g.flechas.push(n)
    })
}

/*
function mostrarNodos(nodos, grupos) {
    var res = []
    var dict = {}
    grupos.forEach(function (g) {
        if (g.mostrar) {
            res.push(g)
            g.nodos.forEach(function (n) {
                dict[n]=g.id
            })
        }
    })
    nodos.forEach(function (n) {

        if (dict.hasOwnProperty(n.id)){
            var gaux = grupos.find(function (g) {
                return g.id==dict[n.id]
            })
            gaux.flechas=n.flechas
        }

        else {
            if (n.tipo == "inicial") res.unshift(n)
            else res.push(n)
            n.flechas = n.flechas.filter(function (f) {
                var m = true
                return (! dict.hasOwnProperty(f))
            })
        }
    })
    console.log(res)
    return res;

}

function addNodes(nodes, g) {
    nodes.forEach(function (n) {
        if (!g.nodos.includes(n)) g.flechas.push(n)
    })
}
*/

function procesarProfundidad(nodes) {

    var ids = [0];
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i]
        var node = nodes.find(function (n) {
            return n.id === id;
        });
        //if (node.tipo == "inicial" || node.tipo == "final" || node.tipo == "normal" || node.tipo == "subproceso")
        for (var j = 0; j < node.flechas.length; j++) {
            var flecha = node.flechas[j]
            if (!ids.includes(flecha)) ids.push(flecha)
            var f = nodes.find(function (n) {
                return n.id === flecha;
            });
            if (f.profundidad < (node.profundidad + 1)) {
                f.profundidad = (node.profundidad + 1)
                ids.push(flecha)
            }
        }
    }
}

function ordenarProfundidad(nodes) {
    nodes.sort(function (a, b) {
        return a.profundidad - b.profundidad
    })
}

function ordenarEtapas(stages, nodes) {
    var sorted = []
    for (var i = 0; i < stages.length; i++) {
        sorted.push({
            nodes: [],
            text: stages[i]
        })
    }
    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        sorted[node.etapa].nodes.push(node)
    }
    return sorted
}

function crearMatriz(nodes, stages, organizations) {

    var matrix = {
        etapas: [],
        organismos: [],
        nodos: []
    }
    var columns = 0;
    var rows = 0;
    for (var i = 0; i < nodes.length; i++) {
        var stage = nodes[i]
        var aux = -1
        var count = 0
        var start = columns
        for (var j = 0; j < stage.nodes.length; j++) {
            node = stage.nodes[j]
            if (node.profundidad != aux) {
                aux = node.profundidad
                count = count + 1
                columns = columns + 1
            }
        }
        matrix.etapas.push({
            size: count,
            text: stage.text,
            start: start,
            finish: columns - 1
        })
    }
    for (var i = 0; i < organizations.length; i++) {

        matrix.organismos.push({
            size: 1,
            text: organizations[i],
            start: i,
            finish: i
        })
        matrix.nodos.push(Array(columns).fill(undefined))
    }
    var rowcount = []
    var column = -1
    for (var i = 0; i < nodes.length; i++) {
        var stage = nodes[i]
        var aux = -1

        for (var j = 0; j < stage.nodes.length; j++) {
            node = stage.nodes[j]
            if (node.profundidad != aux) {
                aux = node.profundidad
                column = column + 1
                rowcount = []
                for (var k = 0; k < matrix.organismos.length; k++) {
                    rowcount.push(matrix.organismos[k].start)
                }
            }
            if (rowcount[node.organismo] > matrix.organismos[node.organismo].finish) {

                matrix.nodos.splice(rowcount[node.organismo], 0, Array(columns).fill(undefined));
                matrix.organismos[node.organismo].size = matrix.organismos[node.organismo].size + 1
                matrix.organismos[node.organismo].finish = matrix.organismos[node.organismo].finish + 1
                for (var k = node.organismo + 1; k < matrix.organismos.length; k++) {
                    matrix.organismos[k].start = matrix.organismos[k].start + 1
                    matrix.organismos[k].finish = matrix.organismos[k].finish + 1
                }
            }
            matrix.nodos[rowcount[node.organismo]][column] = node
            rowcount[node.organismo] = rowcount[node.organismo] + 1
        }
    }
    return matrix
}

function dibujarNodos(matriz) {
    for (var i = 0; i < matriz.nodos.length; i++) {
        for (var j = 0; j < matriz.nodos[i].length; j++) {
            if (matriz.nodos[i][j] != undefined) {
                dibujarNodo(matriz.nodos[i][j], j, i)
            }
        }
    }
}

function dibujarFlechas(matriz) {
    data.flechas = []
    for (var i = 0; i < matriz.nodos.length; i++) {
        for (var j = 0; j < matriz.nodos[i].length; j++) {
            if (matriz.nodos[i][j] != undefined) {
                for (var k = 0; k < matriz.nodos[i][j].flechas.length; k++) {
                    dibujarFlecha(matriz, matriz.nodos[i][j], j, i, matriz.nodos[i][j].flechas[k], k)
                }
            }
        }
    }
    flechas.selectAll("flecha")
        .data(data.flechas).enter()
        .append('path')
        .attr("class", "flecha")

        .attr('d', function (d) {
            if(d.desde.tipo=="pregunta" && d.k==1)  return " M " + (50 + d.x1 * (boxWidth + separation)) + ", " + (100 + d.y1 * (boxHeight + separation)) + "h 20 v 25  h " + (boxWidth / 2 + separation /  -25) + " V " + (100 + d.y2 * (boxHeight + separation)) + "H " + (50 + d.x2 * (boxWidth + separation))
            else return " M " + (50 + d.x1 * (boxWidth + separation)) + ", " + (100 + d.y1 * (boxHeight + separation)) + " h " + (boxWidth / 2 + separation / 2) + " V " + (100 + d.y2 * (boxHeight + separation)) + "H " + (50 + d.x2 * (boxWidth + separation))
        })
        .attr('shape-rendering', 'crispEdges')

    flechas.selectAll("punta")
        .data(data.flechas).enter()
        .append('path')
        .attr("class", "punta")
        .attr('d', function (d) {
            if (d.hacia != undefined && (d.hacia.tipo == "normal" || d.hacia.tipo == "subproceso")) return "M " + (50 + (d.x2) * (boxWidth + separation) - boxWidth / 2) + " ," + (100 + d.y2 * (boxHeight + separation)) + "l -5,-5 v 10 Z"

            else return "M " + (50 + (d.x2) * (boxWidth + separation)) + " ," + (100 + d.y2 * (boxHeight + separation)) + "l -5,-5 v 10 Z"
        })
    //.attr('d', " M " + (50 + x1 * (boxWidth + separation) + boxWidth/2) + ", " + (100 + y1 * (boxHeight + separation)) + " h 20 V " + (100 + y2 * (boxHeight + separation)) + "H " + (50 + x2 * (boxWidth + separation) - boxWidth/2))

}

function dibujarFlecha(matriz, desde, x1, y1, hacia, k) {
    var n2
    for (var i = 0; i < matriz.nodos.length; i++) {
        for (var j = 0; j < matriz.nodos[i].length; j++) {
            if (matriz.nodos[i][j] != undefined && matriz.nodos[i][j].id == hacia) {
                n2 = matriz.nodos[i][j];
                var x2 = j, y2 = i;
            }
        }
    }
    data.flechas.push({
            "k": k,
            "desde": desde,
            "hacia": n2,
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2
        }
    )
}

function dibujarNodo(nodo, x, y) {
    var myclass = !nodo.critico ? "actividad" : "actividad-critica"
    var aux;
    switch (nodo.tipo) {
        case "normal":
            aux = dibujarActividad(nodo, x, y)
            break;
        case "subproceso":
            aux = dibujarActividad(nodo, x, y)
            break;
        case "grupo":
            aux = dibujarGrupo(nodo, x, y)
            break;
        case "inicial":
            aux = dibujarInicio(nodo, x, y)
            break;
        case "final":
            aux = dibujarFin(nodo, x, y)
            break;
        case "paralelo":
            aux = dibujarParalelo(nodo, x, y)
            break;
        case "pregunta":
            aux = dibujarPregunta(nodo, x, y)
            break;
        case "or":
            aux = dibujarOr(nodo, x, y)
            break;
        default:
            break;
    }
    aux.attr('id', 'nodo' + nodo.id)
    aux.on("mouseover", function () {
        d3.select(this).selectAll("rect")
            .classed("highlight", true)
        nodo.flechas.forEach(function (f) {
            actividades.select("[id=nodo" + f + "]").selectAll("rect")
                .classed("highlight", true)
        })
        if (nodo.ley) {
            d3.select("#cnp-tooltip").style('top', (d3.event.pageY - 10) + "px").style('left', (d3.event.pageX) + "px").style('display', 'block');
            d3.select("#cnp-tooltip .cnp-name").html(nodo.ley);
        }

    })
    aux.on("mouseout", function () {
        d3.select(this).selectAll("rect")
            .classed("highlight", false)

        nodo.flechas.forEach(function (f) {
            actividades.select("[id=nodo" + f + "]").selectAll("rect")
                .classed("highlight", false)
        })
        d3.select("#cnp-tooltip").style('display', 'none');


    })
}

function dibujarActividad(nodo, x, y) {
    var myclass
    if (nodo.critico) myclass = "actividad-critica"
    else myclass = nodo.color == 0 ? "actividad" : "blanco"
    var nodoAux = actividades.append('g')
        .attr('class', 'nodo')

    nodoAux.append("rect")
        .attr({
            class: myclass,
            rx: 20,
            ry: 20,
            x: -(boxWidth / 2),
            y: -(boxHeight / 2),
            width: boxWidth,
            height: boxHeight
        })
    nodoAux.append("text")
        .attr("dx", -(boxWidth / 2) + 10)
        .attr("dy", 0)
        .attr('class', 'name')
        .text(nodo.texto)
    nodoAux.attr("transform", "translate(" + (50 + x * (boxWidth + separation)) + "," + (100 + y * (boxHeight + separation)) + ")")

    return nodoAux
}

function dibujarGrupo(nodo, x, y) {
    var myclass = !nodo.critico ? "actividad" : "actividad-critica"
    var nodoAux = actividades.append('g')
        .attr('class', 'nodo')

    nodoAux.append("rect")
        .attr({
            class: myclass,
            rx: 20,
            ry: 20,
            x: -(boxWidth / 2) - 12,
            y: -(boxHeight / 2) - 12,
            width: boxWidth,
            height: boxHeight
        })
    nodoAux.append("rect")
        .attr({
            class: myclass,
            rx: 20,
            ry: 20,
            x: -(boxWidth / 2) - 6,
            y: -(boxHeight / 2) - 6,
            width: boxWidth,
            height: boxHeight
        })
    nodoAux.append("rect")
        .attr({
            class: myclass,
            rx: 20,
            ry: 20,
            x: -(boxWidth / 2),
            y: -(boxHeight / 2),
            width: boxWidth,
            height: boxHeight
        })
    nodoAux.append("text")
        .attr("dx", -(boxWidth / 2) + 10)
        .attr("dy", 0)
        .attr('class', 'name')
        .text(nodo.texto)
    nodoAux.attr("transform", "translate(" + (50 + x * (boxWidth + separation)) + "," + (100 + y * (boxHeight + separation)) + ")")
    nodoAux.on('click', function () {
        toggleGroup(nodo);
    })
    return nodoAux
}

function toggleGroup(grupo) {
    var g = data.grupos.find(function (x) {
        return grupo.id == x.id
    })
    g.mostrar = !g.mostrar
    data.grupos.forEach(function (x) {
        if (grupo.grupos.includes(x.id)) x.mostrar = true
    })
    actividades.selectAll("*").remove();
    flechas.selectAll("*").remove();
    barra_lateral.selectAll("*").remove();
    barra_superior.selectAll("*").remove();
    console.log(data)
    var nodos = inicializarNodos(JSON.parse(JSON.stringify(data.nodos)))
    nodos = mostrarNodos(nodos, data.grupos)
    procesarProfundidad(nodos)
    ordenarProfundidad(nodos)
    var etapas = ordenarEtapas(data.etapas, nodos)
    console.log(etapas)
    var matriz = crearMatriz(etapas, data.etapas, data.organismos)

    dibujarNodos(matriz)
    dibujarFlechas(matriz)
    dibujarLayout(matriz)
    console.log(matriz)
    d3.selectAll(".name").each(function (d, i) {
        d3plus.textwrap()
            .container(d3.select(this))
            .valign("middle")
            .align("center")
            .draw();
    });
}

function dibujarInicio(nodo, x, y) {
    var nodoAux = actividades.append('g')
    nodoAux.append('path')
        .attr("class", "inicio")
        .attr('d', " M " + (50 + x * (boxWidth + separation)) + ", " + (100 + y * (boxHeight + separation)) + " a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0")
    return nodoAux
}

function dibujarFin(nodo, x, y) {
    var nodoAux = actividades.append('g')
    nodoAux.append('path')
        .attr("class", "fin")
        .attr('d', " M " + (50 + x * (boxWidth + separation)) + ", " + (100 + y * (boxHeight + separation)) + " a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0")
    return nodoAux
}

function dibujarParalelo(nodo, x, y) {
    var nodoAux = actividades.append('g')
    nodoAux.append('path')
        .attr("class", "rombo")
        .attr('d', 'M' + (50 + x * (boxWidth + separation)) + ', ' + (100 + y * (boxHeight + separation)) + 'l 20 -20 l 20 20 l -20 20 Z m 20 -10 v 20 v -10 h 10 h -20')
    return nodoAux

}

function dibujarOr(nodo, x, y) {
    var nodoAux = actividades.append('g')
    nodoAux.append('path')
        .attr("class", "rombo")
        .attr('d', 'M' + (50 + x * (boxWidth + separation)) + ', ' + (100 + y * (boxHeight + separation)) + 'l 20 -20 l 20 20 l -20 20 Z  ')
    nodoAux.append('path')
        .attr("class", "rombo")
        .attr('d', " M " + (50 + x * (boxWidth + separation) + 10) + ", " + (100 + y * (boxHeight + separation)) + " a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0")

    return nodoAux

}

function dibujarPregunta(nodo, x, y) {
    var nodoAux = actividades.append('g')
    nodoAux.append('path')
        .attr("class", "rombo")
        .attr('d', 'M' + (50 + x * (boxWidth + separation)) + ', ' + (100 + y * (boxHeight + separation)) + 'l 20 -20 l 20 20 l -20 20 Z ')
    nodoAux.append("text")
        .attr("x", (30 + (x - 1) * (boxWidth + separation)))
        .attr("y", (100 + (y - 2) * (boxHeight + separation)))
        .attr('class', 'name')
        .text(nodo.texto)
    nodoAux.append("text")
        .attr("x", (90 + (x - 1) * (boxWidth + separation)))
        .attr("y", (120 + (y - 2) * (boxHeight + separation)))
        .attr('class', 'name')
        .text("Sí")
    nodoAux.append("text")
        .attr("x", (50 + (x - 1) * (boxWidth + separation)))
        .attr("y", (170 + (y - 2) * (boxHeight + separation)))
        .attr('class', 'name')
        .text("No")
    return nodoAux

}

$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

})
