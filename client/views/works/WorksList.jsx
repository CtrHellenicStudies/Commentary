import baseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";

WorksList = React.createClass({

	getChildContext() {
		return {muiTheme: getMuiTheme(baseTheme)};
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		const query = {};
		return {
			works: Works.find(query, {sort: {order: 1}}).fetch(),
		};
	},


	renderWorks() {
		if (this.data.works.length === 3) {
			return this.data.works.map((work, i) => {
				return (<WorkVisualization
					key={i}
					work={work}
				/>);
			});
		}
	},

	render() {
		return (
			<div>
				{this.renderWorks()}
			</div>
		);
	},

});
