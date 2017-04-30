import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Works from '/imports/api/collections/works';

// components
import WorkVisualization from '/imports/ui/components/works/WorkVisualization';

const WorksList = React.createClass({

	propTypes: {
		works: React.PropTypes.array,
		ready: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	renderWorks() {
		const { works, ready } = this.props;
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

export default createContainer(() => {
	const worksSub = Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();
	return {
		works,
		ready: worksSub.ready(),
	};
}, WorksList);
