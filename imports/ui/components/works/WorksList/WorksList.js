import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// models
import Works from '/imports/models/works';

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
	works: PropTypes.array,
	ready: PropTypes.bool,
};

WorksList.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};


export default createContainer(() => {
	const worksSub = Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();
	return {
		works,
		ready: worksSub.ready(),
	};
}, WorksList);
