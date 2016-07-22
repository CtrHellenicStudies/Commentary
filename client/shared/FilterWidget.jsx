
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

FilterWidget = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

  render(){

		return(

      	<div class="filters">
      		<div class="filter " ng-repeat="filter in filters">
      			<span class="filter-key paper-shadow">{filter.key}</span>
      			<RaisedButton class="filter-val paper-shadow" data-key="{filter.key}" data-id="{val.id}"
      				  ng-repeat="val in filter.vals" ng-click="remove_search_term( $event )">
      				{val.text}
      				<i class="mdi mdi-close"></i>
      			</RaisedButton>


      		</div>

      	</div>


		);
	}

});
