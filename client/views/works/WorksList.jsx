import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Works from '/imports/collections/works';

WorksList = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const worksSub = Meteor.subscribe('works');
		const works = Works.find().fetch();
		return {
			works,
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
