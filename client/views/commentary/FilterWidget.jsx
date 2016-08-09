
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

FilterWidget = React.createClass({

  propTypes: {
    filters: React.PropTypes.array.isRequired,
		toggleSearchTerm: React.PropTypes.func.isRequired
  },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

  render(){

		return(

      	<div className="filters">
					{this.props.filters.map((filter, i) => {
	      		return <div
							key={i}
							className="filter "
							 >
	      			<span className="filter-key paper-shadow">{filter.key}</span>
								{filter.values.map((val, j) => {
				      			return <RaisedButton
											key={j}
											labelPosition="before"
											className="filter-val "
			      				  onClick={this.props.toggleSearchTerm.bind(null, filter.key, val)}
											label={val.title || val.name}
											>

				      				<i className="mdi mdi-close"></i>
				      			</RaisedButton>
								})}


	      		</div>

					})}

      	</div>


		);
	}

});
