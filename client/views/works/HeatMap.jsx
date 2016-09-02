import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

HeatMap = React.createClass({

    getChildContext() {
        return {
            muiTheme: getMuiTheme(baseTheme)
        };
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    propTypes: {
        subworks: React.PropTypes.object,
    },

    componentWillReceiveProps() {
        if(this.props.subworks.title != undefined){
            d3.select(".text-heatmap-visualization-" + this.props.subworks.title + " svg").remove();
        }
    },

    componentDidUpdate() {

        if (this.props.subworks.title != undefined) {
            var that = this;

            var margin = {
                    top: 20,
                    right: 20,
                    bottom: 80,
                    left: 60
                },
                width = 860 - margin.left - margin.right,
                height = 421 - margin.top - margin.bottom;

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

            var data = this.props.subworks.commentHeatmap;
            data.sort(function(a, b) {
                if (a.n < b.n)
                    return -1;
                if (a.n > b.n)
                    return 1;
                return 0;
            });
            var dataN = data.map(function(a) {
                return a.n;
            });

            var color = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                    return d.nComments;
                })])
                .range(["#fbf8ec", "#b6ae97"]);

            var svg = d3.select(".text-heatmap-visualization-" + this.props.subworks.title).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) {
                return d.n;
            }));
            y.domain([0, d3.max(data, function(d) {
                return d.nComments;
            })]);

            // svg.append("g")
            //     .attr("class", "x axis")
            //     .attr("fill", "#999999")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(xAxis)
            //     .append("text")
            //     .attr("x", 360)
            //     .attr("y", 36)
            //     .attr("dx", "1em")
            //     .style("text-anchor", "start")
            //     .text("Book");

            // svg.append("g")
            //     .attr("class", "y axis")
            //     .attr("fill", "#999999")
            //     .call(yAxis)
            //     .append("text")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", -60)
            //     .attr("x", -90)
            //     .attr("dy", "1em")
            //     .style("text-anchor", "end")
            //     .text("Number of Comments");

            var numberOfLines = d3.max(data, function(d) {
                    return d.n;
                });
            var allLines = Array.apply(null, {length: numberOfLines}).map(Number.call, Number)
            allLines.splice(0,1); // remove line number 0

            var cellSize = 12;

            var counter = 1;

            var rect = svg.selectAll(".line")
                .data(allLines)
                .enter()
                .append("rect")
                .attr("class", "line")
                .attr("width", cellSize)
                .attr("height", cellSize)
                // .attr("data-title", "test test")
                .attr("x", function(d) {
                    return Math.floor(d/10.0001) * cellSize;
                })
                .attr("y", function(d) {
                    if(counter != 10){
                        counter++;
                        return (counter - 1) * cellSize;
                    } else {
                        counter = 1;
                        return 10 * cellSize;
                    };
                })
                .attr("fill", '#fff');

            rect.filter(function(d) {
                    return dataN.indexOf(d) > -1;
                })
                .attr("fill", function(d) {
                    var i = dataN.indexOf(d);
                    return color(data[i].nComments);
                });

            // svg.selectAll(".square")
            //     .data(data)
            //     .enter().append("rect")
            //     .attr("class", "square")
            //     .attr("id", function(d) {
            //         return "square-" + d.n + "-" + that.props.subworks.title
            //     })
            //     .attr("x", function(d) {
            //         return x(d.n);
            //     })
            //     .attr("width", x.rangeBand())
            //     // .attr("y", function(d) {
            //     //     if ("nComments" in d && typeof d.nComments !== "undefined" && d.nComments && !isNaN(d.nComments)) {
            //     //         return y(d.nComments);
            //     //     } else {
            //     //         return y(0);
            //     //     }
            //     // })
            //     .attr("fill", function(d) {
            //         return color(d.nComments)
            //     })
            //     .attr("height", x.rangeBand());

            // var nest = d3.nest()
            //     .key(function(d) {
            //         return d.nComments;
            //     })
            //     .entries(data);
            // console.log('nest', nest)
        };
    },

    render() {

        var subworks = this.props.subworks;

        return <div>
        
        {
        	(Object.keys(subworks).length > 0) ?  <div className={"text-subworks text-heatmap-visualization-" + this.props.subworks.title}></div>




            : <div></div>
        }

        </div>
    }

});