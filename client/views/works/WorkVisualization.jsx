import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

WorkVisualization = React.createClass({

    getInitialState() {

        return {
            selectedBar: -1,
            svg: undefined,
            cellSize: 16,
            cellPadding: 4, 
        }
    },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  propTypes: {
    work: React.PropTypes.object.isRequired
  },

    componentDidMount() {

        var that = this;

        var slug = that.props.work.slug;

        // --- BEGIN SVG --- //
        var margin = {
                top: 20,
                right: 20,
                bottom: 80,
                left: 60
            },
            width = 970 - margin.left - margin.right,
            height = 421 - margin.top - margin.bottom;

        var barGraphMargin = {
            left: 60,
        };

        var svg = d3.select(".text-subworks-visualization-" + slug).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.setState({
            svg: svg,
        });
        // --- END SVG --- //

        // --- BEGIN BARGRAPH --- //
        // Create bargraph group:
        var barGraph = svg.append("g")
            .attr("class", "bargraph-" + slug);

        // Data preporation:
        var dataBarGraph = this.props.work.subworks;
        dataBarGraph.sort(function(a, b) {
            if (a.n < b.n)
                return -1;
            if (a.n > b.n)
                return 1;
            return 0;
        });

        // Color scale:
        var color = d3.scale.linear()
            .domain([0, d3.max(dataBarGraph, function(d) {
                return d.nComments;
            })])
            .range(["#fbf8ec", "#b6ae97"]);

        // --- BEGIN X-AXIS --- //
        var x = d3.scale.ordinal()
            .rangeRoundBands([barGraphMargin.left, width], .4);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        x.domain(dataBarGraph.map(function(d) {
            return d.n;
        }));

        var barGraph_xAxis = barGraph.append("g")
            .attr("class", "bargraph-x-axis-" + slug);

        barGraph_xAxis.append("g")
            .attr("class", "bargraph-x-axis-rect-" + slug)
            .append("rect")
            .attr("x", barGraphMargin.left)
            .attr("y", 0)
            .attr("width", width - barGraphMargin.left)
            .attr("height", 60)
            .attr("transform", "translate(0," + height + ")")
            .attr("fill", "#efebde");

        // barGraph_xAxis.append("g")
        //     .attr("class", "axis bargraph-x-axis-ticks-" + slug)
        //     // .attr("fill", "#999999")
        //     .attr("transform", "translate(0," + (height + 15) + ")")
        //     .call(xAxis);

        barGraph_xAxis.append("g")
            .attr("class", "bargraph-x-axis-label-" + slug)
            .append("text")
            .attr("x", -13)
            .attr("y", height + 35)
            .attr("dx", "1em")
            .style("text-anchor", "start")
            .text("BOOK");
        // --- END X-AXIS --- //
        
        // --- BEGIN Y-AXIS --- //
        var y = d3.scale.linear()
            .range([height, 0]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(10)
            .tickSize(-width)
            .orient("left");

        y.domain([0, d3.max(dataBarGraph, function(d) {
            return d.nComments;
        })]);

        var barGraph_yAxis = barGraph.append("g")
            .attr("class", "bargraph-y-axis-" + slug);

        barGraph_yAxis.append("g")
            .attr("class", "axis y-axis bargraph-y-axis-lines-" + slug)
            .attr("fill", "#999999")
            .call(yAxis);

        barGraph_yAxis.append("g")
            .attr("class", "bargraph-y-axis-label-" + slug)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", 5)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("# OF COMMENTS");
        // --- END Y-AXIS --- //
        
        // --- BEGIN BARS --- //
        var barGraph_bars = barGraph.append("g")
            .attr("class", "bargraph-bars-" + slug)
            .selectAll("g[class^='bargraph-bar-']")
            .data(dataBarGraph)
            .enter().append("g")
            .attr("class", function(d) {
                return "bargraph-bar-" + slug + "-" + d.n
            });

        barGraph_bars
            .append("rect")
            .attr("class", function(d) {
                return "bargraph-bar-column-" + slug + "-" + d.n;
            })
            .attr("x", function(d) {
                return x(d.n);
            })
            .attr("x_origin", function(d) {
                return x(d.n);
            })
            .attr("width", x.rangeBand())
            .attr("width_origin", x.rangeBand())
            .attr("y", function(d) {
                if ("nComments" in d && typeof d.nComments !== "undefined" && d.nComments && !isNaN(d.nComments)) {
                    return y(d.nComments);
                } else {
                    return y(0);
                }
            })
            .attr("y_origin", function(d) {
                if ("nComments" in d && typeof d.nComments !== "undefined" && d.nComments && !isNaN(d.nComments)) {
                    return y(d.nComments);
                } else {
                    return y(0);
                }
            })
            .attr("fill", function(d) {
                return color(d.nComments)
            })
            .attr("fill_origin", function(d) {
                return color(d.nComments)
            })
            .attr("height", function(d) {
                return height - y(d.nComments);
            })
            .attr("height_origin", function(d) {
                return height - y(d.nComments);
            });

        var footSize = 4;
        barGraph_bars
            .append("rect")
            .attr("class", function(d) {
                return "bargraph-bar-foot-" + slug + "-" + d.n;
            })
            .attr("x", function(d) {
                return x(d.n) - footSize;
            })
            .attr("y", height - footSize)
            .attr("width", x.rangeBand() + footSize*2)
            .attr("height", footSize)
            .attr("fill", function(d) {
                return color(d.nComments)
            });

        barGraph_bars
            .append("text")
            .attr("class", function(d) {
                return "bargraph-bar-label-" + slug + "-" + d.n;
            })
            .attr("x", function(d) {
                return x(d.n) + x.rangeBand()/2;
            })
            .attr("y", height + 35)
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.n;
            })

       barGraph_bars
            .on("click", function(d) {
                // // var selectedBar = that.state.selectedBar;
                // var slug = that.props.work.slug;

                that.setState({
                    selectedBar: d.n,
                });

                //  TODO: get the real number of lines per book - not from the works collection:
                var numberOfLines = d3.max(that.props.work.subworks[that.state.selectedBar-1].commentHeatmap, function(d) {
                    return d.n;
                });
                var cellSize = that.state.cellSize;
                var cellPadding = that.state.cellPadding;
                var heatMapWidth = Math.ceil(numberOfLines / 10) * (cellSize + cellPadding) - cellPadding;

                var heatMapHeight = 10 *(cellSize + cellPadding) - cellPadding

                // --- BEGIN ANIMATION - EXPAND BAR --- //
                // Hide BarGraph:
                var selectBarGraph = d3.selectAll(".bargraph-x-axis-" + slug + ",.bargraph-y-axis-" + slug + ",[class^='bargraph-bar-" + slug + "-']");
                selectBarGraph.transition()
                    .duration(1000)
                    .style("opacity", 0);
                selectBarGraph.transition()
                    .delay(3000)
                    .style("display", "none");

                // Expand bar:
                var suffix = slug + "-" + d.n;
                var selectBar = d3.select(".bargraph-bar-" + suffix);
                selectBar.transition()
                    .style("opacity", 1);
                d3.select(".bargraph-bar-foot-" + suffix).transition()
                    .duration(1000)
                    .style("opacity", 0);
                d3.select(".bargraph-bar-label-" + suffix).transition()
                    .duration(1000)
                    .style("opacity", 0);

                var selectBar = d3.select(".bargraph-bar-column-" + suffix);
                selectBar.transition()
                    .style("opacity", 1);
                selectBar.transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("fill", "#d59518")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", heatMapHeight)
                    .attr("width", heatMapWidth);
                selectBar.transition()
                    .delay(2000)
                    .duration(1000)
                    .style("opacity", 0);
                selectBar.transition()
                    .delay(3000)
                    .style("display", "none");
                // --- END ANIMATION - EXPAND BAR --- //

            })
            .on("mouseover", function(d) {
                var suffix = slug + "-" + d.n;
                d3.select(".bargraph-bar-column-" + suffix)
                    .attr("fill", "#d59518")
                    .style("cursor", "pointer");
                d3.select(".bargraph-bar-foot-" + suffix)
                    .attr("fill", "#d59518")
                    .style("cursor", "pointer");
                d3.select(".bargraph-bar-label-" + suffix)
                    .attr("fill", "#d59518")
                    .style("text-decoration", "underline")
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                var suffix = slug + "-" + d.n;
                d3.select(".bargraph-bar-column-" + suffix)
                    .attr("fill", function(d) {
                        return color(d.nComments)
                    });
                d3.select(".bargraph-bar-foot-" + suffix)
                    .attr("fill", function(d) {
                        return color(d.nComments)
                    });
                d3.select(".bargraph-bar-label-" + suffix)
                    .attr("fill", "#000000")
                    .style("text-decoration", "none");
            })
        // --- END BARS --- //
        // --- END BARGRAPH --- //
    },

    componentDidUpdate() {

        var that = this;

        // --- BEGIN HEATMAP --- //
        if (this.state.selectedBar > -1) {
            var dataHeatMap = this.props.work.subworks[this.state.selectedBar-1].commentHeatmap;
            dataHeatMap.sort(function(a, b) {
                if (a.n < b.n)
                    return -1;
                if (a.n > b.n)
                    return 1;
                return 0;
            });

            // Color scale:
            var color = d3.scale.linear()
                .domain([0, d3.max(dataHeatMap, function(d) {
                    return d.nComments;
                })])
                .range(["#fbf8ec", "#b6ae97"]);
            var dataN = dataHeatMap.map(function(a) {
                return a.n;
            });

            //  TODO: get the real number of lines per book - not from the works collection:
            var numberOfLines = d3.max(dataHeatMap, function(d) {
                return d.n;
            });
            var allLines = Array.apply(null, {
                length: numberOfLines
            }).map(Number.call, Number)
            allLines.splice(0, 1); // remove line number 0
            allLines.push(numberOfLines);

            // Define the div for the tooltip:
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var cellSize = this.state.cellSize;
            var cellPadding = this.state.cellPadding;

            var tooltipOffsetLeft = 83;
            var tooltipOffsetLTop = 0;

            var counter = 0;

            // Remove old heatmap:
            d3.select(".heatmap-" + this.props.work.slug).remove();

            // Create heatmap group:
            var heatmap = this.state.svg
                .append("g")
                .attr("class", "heatmap-" + this.props.work.slug)
                .style("display", "none")
                .style("opacity", 0);

            // --- BEGIN HEATMAP CELLS --- //
            var rect = heatmap
                .append("g")
                .attr("class", "heatmap-cells-" + this.props.work.slug)
                .selectAll(".heatmap-cell")
                .data(allLines)
                .enter()
                .append("rect")
                .attr("class", "heatmap-cell")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                    return Math.floor(d / 10.0001) * (cellSize + cellPadding);
                })
                .attr("y", function(d) {
                    if (counter != 9) {
                        var y = counter * cellSize + cellPadding * counter;
                        counter++;
                        return y;
                    } else {
                        var y = counter * cellSize + cellPadding * counter;
                        counter = 0;
                        return y;
                    };
                })
                .attr("fill", '#fff')
                .on("mouseover", function(d) {
                    d3.select(this)
                        .classed('heatmap-cell-selected', true);
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    var i = dataN.indexOf(d);
                    var elementOffset = $('.text-subworks-visualization-' + that.props.work.slug).offset()
                    var cellPositionX = parseInt(d3.select(this).attr('x'));
                    var cellPositionY = parseInt(d3.select(this).attr('y'));
                    if (i > -1) {
                        tooltip.html('Line number: ' + d + ', Comments: ' + dataHeatMap[i].nComments)
                            .style("left", elementOffset.left + cellPositionX + tooltipOffsetLeft + "px")
                            .style("top", elementOffset.top + cellPositionY + tooltipOffsetLTop + "px");
                    } else {
                        tooltip.html('Line number: ' + d + ', Comments: 0')
                            .style("left", elementOffset.left + cellPositionX + tooltipOffsetLeft + "px")
                            .style("top", elementOffset.top + cellPositionY + tooltipOffsetLTop + "px");
                    }
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .classed('heatmap-cell-selected', false);
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // Add fill color to commented lines:
            rect.filter(function(d) {
                return dataN.indexOf(d) > -1;
            })
                .attr("fill", function(d) {
                    var i = dataN.indexOf(d);
                    return color(dataHeatMap[i].nComments);
                });
            // --- END HEATMAP CELLS --- //

            // --- BEGIN HEATMAP Y LABEL --- //
            var arrayData = [1,2,3,4,5,6,7,8,9,10];
            var rect = heatmap
                .append("g")
                .attr("class", "heatmap-y-labels-" + this.props.work.slug)
                .selectAll(".heatmap-label-y")
                .data(arrayData)
                .enter()
                .append("text")
                .attr("class", "heatmap-label-y")
                .attr("fill", "#d7d1c0")
                .attr("text-anchor", "middle")
                .attr("x", -15)
                .attr("y", function(d) {
                    return that.state.cellSize - that.state.cellPadding + (that.state.cellSize + that.state.cellPadding) * (d - 1);
                })
                .text(function(d) {
                    return d;
                });
            // --- END HEATMAP Y LABEL --- //

            // --- BEGIN HEATMAP X LABEL --- //
            var numberOfLines10 = Math.ceil(allLines.length/10);
            var allLines10 = Array.apply(null, {
                length: numberOfLines10
            }).map(Number.call, Number);
            console.log('allLines10', allLines10);
            // allLines10.splice(0, 1); // remove line number 0
            // allLines10.push(numberOfLines10);

            var rect = heatmap
                .append("g")
                .attr("class", "heatmap-x-labels-" + this.props.work.slug)
                .selectAll(".heatmap-label-x")
                .data(allLines10)
                .enter()
                .append("text")
                .attr("class", "heatmap-label-x")
                .attr("fill", "#d7d1c0")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return that.state.cellSize/2 +  (that.state.cellSize + that.state.cellPadding) * d;
                })
                .attr("y", -10)
                .text(function(d) {
                    return d;
                });
            // --- END HEATMAP X LABEL --- //

            // --- BEGIN ANIMATION - SHOW HEATMAP --- //
            var selectHeatMap = d3.select(".heatmap-" + this.props.work.slug);
            selectHeatMap.transition()
                .delay(900)
                .style("display", "");
            selectHeatMap.transition()
                .delay(2000)
                .duration(1000)
                .style("opacity", 1);
            // --- END ANIMATION - SHOW HEATMAP --- //
        }
        // --- END HEATMAP --- //  
},
    showBarGraph() {

        var that = this;

        var slug = that.props.work.slug;

        // --- BEGIN ANIMATION - HIDE HEATMAP --- //
        var selectHeatMap = d3.select(".heatmap-" + this.props.work.slug)
        selectHeatMap.transition()
            .duration(1000)
            .style("opacity", 0);
        selectHeatMap.transition()
            .delay(1000)
            .style("display", "none");
        // --- END ANIMATION - HIDE HEATMAP --- //

        // --- BEGIN ANIMATION - CONTRACT BAR --- //
        // Contract Bar:
        var suffix = slug + "-" + this.state.selectedBar;
        var selectBar = d3.select(".bargraph-bar-column-" + suffix);
        selectBar.transition()
            .style("display", "");
        selectBar.transition()
            .delay(50)
            .duration(950)
            .style("opacity", 1);
        selectBar.transition()
            .delay(1000)
            .duration(500)
            .attr("width", selectBar.attr("width_origin"))
            .attr("height", selectBar.attr("height_origin"))
            .attr("x", selectBar.attr("x_origin"))
            .attr("y", selectBar.attr("y_origin"))
            .attr("fill", selectBar.attr("fill_origin"));

        d3.select(".bargraph-bar-foot-" + suffix).transition()
            .delay(1550)
            .style("opacity", 1);
        d3.select(".bargraph-bar-label-" + suffix).transition()
            .delay(1550)
            .style("opacity", 1);

        // Show BarGraph:
        var selectBarGraph = d3.selectAll(".bargraph-x-axis-" + slug + ",.bargraph-y-axis-" + slug + ",[class^='bargraph-bar-" + slug + "-']");
        selectBarGraph.transition()
            .delay(1550)
            .style("display", "");
        selectBarGraph.transition()
            .delay(1600)
            .duration(500)
            .style("opacity", 1);
        // --- END ANIMATION - CONTRACT BAR --- //
    },

  render() {
    let work = this.props.work;
    let work_url = "/commentary/?q=work." + work.slug ;

     return (
       <div className="work-teaser">
         <div className={"commentary-text " + work.slug}>

            <a href="/commentary"  >
                <h3 className="text-title">{work.title}</h3>
            </a>

            <hr className="text-divider" />

            <div className="text-meta">
            </div>


            <div className={"text-subworks text-subworks-visualization-" + work.slug}>

            </div>

            <FlatButton
                onClick={this.showBarGraph}
                label="Back"
                >

            </FlatButton>

          </div>

        </div>
      );
    }

});
