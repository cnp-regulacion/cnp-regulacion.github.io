var cnp = cnp || {};

cnp.Chart = function () {
    return {
        $j: jQuery,
        //defaults
        width: 970,
        height: 850,
        groupPadding: 10,
        totalValue: 500,
        //will be calculated later
        boundingRadius: null,
        maxRadius: null,
        centerX: null,
        centerY: null,
        scatterPlotY: null,
        //d3 settings
        defaultGravity: 0.1,
        defaultCharge: function (d) {
            return d.value * -10
        },
        links: [],
        nodes: [],
        positiveNodes: [],
        force: {},
        svg: {},
        circle: {},
        gravity: null,
        charge: null,
        fillColor: d3.scale.ordinal().domain([0, 31]).range(["#f6334f", "#eeff0a", "#e79620", "#fe6001", "#fdd14f", "#e9844c", "#e8624e", "#fc3619", "#eab111", "#e9db18", "#ff9d50", "#e67900", "#f7b24e", "#fe7147", "#fdf34c", "#e8521e", "#ff8a0d", "#e66c2c", "#ffa505", "#fe7923", "#e9c513", "#ff4a46", "#e7c04e", "#fc5935", "#e78c39", "#e7a34e", "#e74f4f", "#e7754e", "#febe39", "#f4df4f", "#fed216", "#fc4b00", "#ff824b", "#eced14"]),
        getFillColor: null,

        rScale: d3.scale.linear().domain([0, 113]).range([20, 110]),
        radiusScale: null,
        changeScale: d3.scale.linear().domain([-0.28, 0.28]).range([620, 180]).clamp(true),
        sizeScale: d3.scale.linear().domain([0, 110]).range([0, 1]),
        groupScale: {},

        //data settings
        currentYearDataColumn: 'budget_2013',
        data: cnp.budget_array_data,
        categoryPositionLookup: {},
        categoriesList: [],

        //
        //
        //
        init: function () {
            var that = this;


            this.scatterPlotY = this.changeScale(0);



            this.radiusScale = function (n) {
                return that.rScale(n);
            };
            this.getFillColor = function (d) {

                return that.fillColor(d.sid);
            };

            this.boundingRadius = this.radiusScale(this.totalValue);
            this.centerX = this.width / 2;
            this.centerY = 300;

            cnp.category_data.sort(function (a, b) {
                return b['total'] - a['total'];
            });

            //calculates positions of the category clumps
            //it is probably overly complicated
            var columns = [4, 8, 10, 10];
            rowPadding = [150, 100, 90, 80, 70],
                rowPosition = [220, 450, 600, 720, 817],
                rowOffsets = [130, 80, 60, 45, 48];
            currentX = 0,
                currentY = 0;
            for (var i = 0; i < cnp.category_data.length; i++) {
                var t = 0,
                    w,
                    numInRow = -1,
                    positionInRow = -1,
                    currentRow = -1,
                    cat = cnp.category_data[i]['label'];
                // calc num in this row
                for (var j = 0; j < columns.length; j++) {
                    if (i < (t + columns[j])) {
                        numInRow = columns[j];
                        positionInRow = i - t;
                        currentRow = j;
                        break;
                    }
                    t += columns[j];
                }
                if (numInRow === -1) {
                    numInRow = cnp.category_data.length - d3.sum(columns);
                    currentRow = columns.length;
                    positionInRow = i - d3.sum(columns)
                }
                cnp.category_data[i].row = currentRow;
                cnp.category_data[i].column = positionInRow;
                w = (this.width - 2 * rowPadding[currentRow]) / (numInRow - 1);
                currentX = w * positionInRow + rowPadding[currentRow];
                currentY = rowPosition[currentRow];
                this.categoriesList.push(cat);
                this.categoryPositionLookup[cat] = {
                    x: currentX,
                    y: currentY,
                    w: w * 0.9,
                    offsetY: rowOffsets[currentRow],
                    numInRow: numInRow,
                    positionInRow: positionInRow
                }
            }
            //
            this.groupScale = d3.scale.ordinal().domain(this.categoriesList).rangePoints([0, 1]);

            // Builds the nodes data array from the original data
            for (var i = 0; i < this.data.length; i++) {
                var n = this.data[i];
                var out = {
                    sid: n['id'],
                    radius: this.radiusScale(n[this.currentYearDataColumn]),
                    detail: n['detail'],
                    group: n['department'],
                    value: n[this.currentYearDataColumn],
                    name: n['name'],
                    discretion: n['discretion'],
                    positions: n.positions,
                    x: Math.random() * 1000,
                    y: Math.random() * 1000
                };
                if (n.positions.total) {
                    out.x = n.positions.total.x + (n.positions.total.x - (that.width / 2)) * 0.5;
                    out.y = n.positions.total.y + (n.positions.total.y - (150)) * 0.5;
                }
                this.nodes.push(out)
            }
            this.nodes.sort(function (a, b) {
                return Math.abs(b.value) - Math.abs(a.value);
            });

            this.svg = d3.select("#cnp-chartCanvas").append("svg:svg")
                .attr("width", this.width);


            var departmentOverlay = $j("#cnp-departmentOverlay");

            for (var i = 0; i < cnp.category_data.length; i++) {
                var cat = cnp.category_data[i]['label'];
                var catLabel = cnp.category_data[i]['short_label'];
                var catTot = cnp.category_data[i]['total'];
                var catWidth = this.categoryPositionLookup[cat].w;
                var catYOffset = this.categoryPositionLookup[cat].offsetY;
                var catNode;
                if (catLabel === "Other") {
                    catNode = $j("<div class='cnp-departmentAnnotation cnp-row" + cnp.category_data[i]['row'] + "'><p class='department'>" + catLabel + "</p></div>")

                } else {
                    catNode = $j("<div class='cnp-departmentAnnotation cnp-row" + cnp.category_data[i]['row'] + "'><p class='department'>" + catLabel + "</p><p class='total'>" + catTot + "</p></div>")

                }
                catNode.css({
                    'left': this.categoryPositionLookup[cat].x - catWidth / 2,
                    'top': this.categoryPositionLookup[cat].y - catYOffset,
                    'width': catWidth
                });
                departmentOverlay.append(catNode)

            }
            // This is the every circle
            this.circle = this.svg.selectAll("circle")
                .data(this.nodes, function (d) {
                    return d.sid;
                });
            this.circle.selectAll("arc")
                .data(function (d) {
                    return d.detail
                })
                .enter()
                .append("g")
                .attr("class", "arc").append("path")
                .attr("fill", function(d, i) {
                    return d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c'])(i);
                })
                .attr("d", function (d) {
                    console.log(d)
                    return d3.arc()
                        .innerRadius(0)
                        .outerRadius(d.radius);
                });

            this.circle.enter().append("svg:circle")
                .attr("r", function (d) {
                    return 0;
                })
                .style("fill", function (d) {
                    return that.getFillColor(d);
                })
                .style("stroke-width", 1)
                .attr('id', function (d) {
                    return 'cnp-circle' + d.sid
                })
                .on("mouseover", function (d, i) {
                    var el = d3.select(this);
                    var xpos = Number(el.attr('cx'));
                    var ypos = (el.attr('cy') - d.radius - 10);
                    el.style("stroke", "#000").style("stroke-width", 3);
                    d3.select("#cnp-tooltip").style('top', ypos + "px").style('left', xpos + "px").style('display', 'block');
                    d3.select("#cnp-tooltip .cnp-name").html(d.name);
                    d3.select("#cnp-tooltip .cnp-value").html(d.value + " Permisos")

                })
                .on("mouseout", function (d, i) {
                    d3.select(this).style("stroke-width", 0);
                    d3.select("#cnp-tooltip").style('display', 'none')
                });


            this.circle.transition().duration(2000).attr("r", function (d) {
                return d.radius
            })

        },


        start: function () {
            var that = this;

            this.force = d3.layout.force()
                .nodes(this.nodes)
                .size([this.width, this.height])


        },


        totalLayout: function () {
            var that = this;
            this.force
                .gravity(-0.01)
                .charge(that.defaultCharge)
                .friction(0.9)
                .on("tick", function (e) {
                    that.circle
                        .each(that.totalSort(e.alpha))
                        .each(that.buoyancy(e.alpha))
                        .attr("cx", function (d) {
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            return d.y;
                        });
                })
                .start();

        },

        departmentLayout: function () {
            var that = this;
            this.force
                .gravity(0)
                .charge(1)
                .friction(0)
                .on("tick", function (e) {
                    that.circle
                        .each(that.staticDepartment(e.alpha))
                        .attr("cx", function (d) {
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            return d.y;
                        });
                })
                .start();
        },


        totalSort: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.centerY;
                var targetX = that.width / 2;


                //
                d.y = d.y + (targetY - d.y) * (that.defaultGravity + 0.02) * alpha;
                d.x = d.x + (targetX - d.x) * (that.defaultGravity + 0.02) * alpha

            };
        },

        buoyancy: function (alpha) {
            var that = this;
            return function (d) {


                var targetY = that.centerY;
                d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha * alpha * alpha * 100


            };
        },

        staticDepartment: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = 0;
                var targetX = 0;

                if (d.positions.department) {
                    targetX = that.categoryPositionLookup[d.name].x;
                    targetY = that.categoryPositionLookup[d.name].y;
                }
                d.y += (targetY - d.y) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.6;
                d.x += (targetX - d.x) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.4
            };
        },


        collide: function (alpha) {
            var that = this;
            var padding = 6;
            var quadtree = d3.geom.quadtree(this.nodes);
            return function (d) {
                var r = d.radius + that.maxRadius + padding,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d) && (d.group === quad.point.group)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius;
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 ||
                        x2 < nx1 ||
                        y1 > ny2 ||
                        y2 < ny1;
                });
            };

        }

    }
};


/********************************
 ** FILE: ChooseList.js
 ********************************/

var cnp = cnp || {};
var $j = jQuery;

cnp.ChooseList = function (node, changeCallback) {
    this.container = $j(node);
    this.selectedNode = null;
    this.currentIndex = null;
    this.onChange = changeCallback;
    this.elements = this.container.find('li');
    this.container.find('li').on('click', $j.proxy(this.onClickHandler, this));
    this.selectByIndex(0);
};

cnp.ChooseList.prototype.onClickHandler = function (evt) {
    evt.preventDefault();
    this.selectByElement(evt.currentTarget);
};


cnp.ChooseList.prototype.selectByIndex = function (i) {
    this.selectByElement(this.elements[i])
};


cnp.ChooseList.prototype.selectByElement = function (el) {
    if (this.selectedNode) {
        $j(this.selectedNode).removeClass("selected");
    }
    $j(el).addClass("selected");
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i] === el) {
            this.currentIndex = i;
        }
    }
    this.selectedNode = el;
    this.onChange(this);
};


/********************************
 ** FILE: base.js
 ********************************/

var $j = jQuery;

cnp.filename = function (index) {
    var tabs = [
        "total",
        "department"
    ];
    return tabs[index];
};

cnp.ready = function () {
    var that = this;
    cnp.c = new cnp.Chart();
    cnp.c.init();
    cnp.c.start();

    this.highlightedItems = [];

    var currentOverlay = undefined;
    cnp.mainNav = new cnp.ChooseList($j(".cnp-navigation"), onMainChange);

    function onMainChange(evt) {
        var tabIndex = evt.currentIndex;
        if (this.currentOverlay !== undefined) {
            this.currentOverlay.hide();
        }
        if (tabIndex === 0) {
            cnp.c.totalLayout();
            this.currentOverlay = $j("#cnp-totalOverlay");
            this.currentOverlay.delay(300).fadeIn(500);
            $j("#cnp-chartFrame").css({
                'height': 550
            });
        } else if (tabIndex === 1) {
            cnp.c.departmentLayout();
            this.currentOverlay = $j("#cnp-departmentOverlay");
            this.currentOverlay.delay(300).fadeIn(500);
            $j("#cnp-chartFrame").css({
                'height': 850
            });
        }
    }
};

if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect) {
    $j(document).ready($j.proxy(cnp.ready, this));
} else {
    $j("#cnp-chartFrame").hide();
}