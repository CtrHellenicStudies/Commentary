import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Works from '/imports/api/collections/works';

// components
import WorkVisualization from '/imports/ui/components/works/WorkVisualization';

// lib
import muiTheme from '/imports/lib/muiTheme';


class WorksList extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

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
	}

	render() {
		return (
			<div>
				{this.renderWorks()}
			</div>
		);
	}

}

WorksList.propTypes = {
	works: React.PropTypes.array,
	ready: React.PropTypes.bool,
};

WorksList.childContextTypes = {
	muiTheme: React.PropTypes.object.isRequired,
};


export default createContainer(() => {
	const worksSub = Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();
	return {
		works,
		ready: worksSub.ready(),
	};
}, WorksList);
