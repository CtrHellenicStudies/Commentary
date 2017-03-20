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
		const worksSub = Meteor.subscribe('works', Session.get('tenantId'));
		const works = Works.find().fetch();
		return {
			works,
			ready: worksSub.ready(),
		};
	},

	renderWorks() {
		const { works, ready } = this.data;
		if (ready) {
			return works.map((work, i) => (
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
