import RaisedButton from 'material-ui/RaisedButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

WorkVisualization = React.createClass({

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

		var margin = {top: 20, right: 20, bottom: 30, left: 40},
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
		    .orient("left")
		    .ticks(10, "%");

		var data = this.props.work.subworks;

		var color = d3.scale.ordinal()
    .domain([0, d3.max(data, function(d) { return d.nComments; })])
    .range(["#fbf8ec", "#b6ae97"]);

		var svg = d3.select(".text-subworks-visualization-" + this.props.work.slug).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  x.domain(data.map(function(d) { return d.n; }));
		  y.domain([0, d3.max(data, function(d) { return d.nComments; })]);

		  svg.append("g")
		      .attr("class", "x axis")
					.attr("fill", "#999999")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .append("text")
		      .attr("x", 1)
		      .attr("dx", "-1em")
		      .style("text-anchor", "end")
		      .text("Book");

		  svg.append("g")
		      .attr("class", "y axis")
					.attr("fill", "#999999")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 1)
		      .attr("dy", "1em")
		      .style("text-anchor", "end")
		      .text("Number of Comments");

		  svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
					.attr("fill", function(d){ return color(d.nComments) })
		      .attr("x", function(d) { return x(d.n); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.nComments); })
		      .attr("height", function(d) { return height - y(d.nComments); });

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


          </div>

        </div>
      );
    }

});
