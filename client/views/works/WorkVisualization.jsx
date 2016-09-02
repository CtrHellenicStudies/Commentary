import RaisedButton from 'material-ui/RaisedButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

WorkVisualization = React.createClass({

    getInitialState() {

        return {
            selectedBar: -1,
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

	componentDidMount(){

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

        var data = this.props.work.subworks;
        data.sort(function(a, b) {
            if (a.n < b.n)
                return -1;
            if (a.n > b.n)
                return 1;
            return 0;

        });

        var color = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
                return d.nComments;
            })])
            .range(["#fbf8ec", "#b6ae97"]);

        var svg = d3.select(".text-subworks-visualization-" + this.props.work.slug).append("svg")
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

        svg.append("g")
            .attr("class", "x axis")
            .attr("fill", "#999999")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", 360)
            .attr("y", 36)
            .attr("dx", "1em")
            .style("text-anchor", "start")
            .text("Book");

        svg.append("g")
            .attr("class", "y axis")
            .attr("fill", "#999999")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -90)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("Number of Comments");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d) {
                return "bar-" + d.n + "-" + that.props.work.slug
            })
            .attr("x", function(d) {
                return x(d.n);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                if ("nComments" in d && typeof d.nComments !== "undefined" && d.nComments && !isNaN(d.nComments)) {
                    return y(d.nComments);
                } else {
                    return y(0);
                }
            })
            .attr("fill", function(d) {
                return color(d.nComments)
            })
            .attr("height", function(d) {
                return height - y(d.nComments);
            })
            .on("click", function(d) {
                var selectedBar = that.state.selectedBar;
                //  No bar selected - new bar clicked:
                if (selectedBar === -1) {
                    d3.select(this).attr("fill", "#d59518");
                    that.setState({
                        selectedBar: d.n
                    });
                }
                // Clicked bar is selected - toggle bar:
                else if (selectedBar === d.n) {
                    d3.select(this).attr("fill", color(d.nComments));
                    that.setState({
                        selectedBar: -1
                    });
                }
                // Other bar is selected:
                else {
                    d3.select(this).attr("fill", "#d59518");
                    d3.select("#bar-" + selectedBar + "-" + that.props.work.slug).attr("fill", function(d) {
                        return color(d.nComments)
                    });
                    that.setState({
                        selectedBar: d.n
                    });
                };
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill", "#d59518")
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                if (that.state.selectedBar != d.n) {
                    d3.select(this)
                        .attr("fill", function(d) {
                            return color(d.nComments)
                        })
                        .style("cursor", "default");
                }
            });
    },

    renderHeatmap() {
        var subworks = {};
        if (this.state.selectedBar > 0) {
            subworks = this.props.work.subworks[this.state.selectedBar - 1];
        };
    	return <HeatMap 
                subworks={subworks}
                />
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

            <div>
                {this.renderHeatmap()}
            </div>

          </div>

        </div>
      );
    }

});
