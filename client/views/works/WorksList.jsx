import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

WorksList = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const query = {};
		return {
			works: Works.find(query, { sort: { order: 1 } }).fetch(),
		};
	},


	renderWorks() {
		if (this.data.works.length === 3) {
			return this.data.works.map((work, i) => (
				<WorkVisualization
					key={i}
					work={work}
				/>
			));
		}
		return '';
	},

	render() {
		return (
			<div>
				{this.renderWorks()}
			</div>
		);
	},

});
