
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

WorksList = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},


  renderWorks(){

    return this.data.works.map((work, i) => {
      return <WorkVisualization
              key={i}
              work={work} />;

    });

  },

  render(){

		return(
      {this.renderWorks()}

		);
	}

});
