import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// models
import Works from '/imports/models/works';

// components
import WorkVisualization from '/imports/ui/components/works/WorkVisualization';

// graphql
import { worksQuery } from '/imports/graphql/methods/works';

// lib
import muiTheme from '/imports/lib/muiTheme';


class WorksList extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	renderWorks() {
		const { works} = this.props;
		return works.map((work, i) => (
			<WorkVisualization
				key={i}
				work={work}
			/>
		));
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
};

WorksList.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};


const cont = createContainer((props) => {

	const tenantId = Session.get('tenantId');
	if (tenantId) {
		props.worksQuery.refetch({
			tenantId: tenantId
		});
	}
	const works = props.worksQuery.loading ? [] : props.worksQuery.works;
	return {
		works
	};
}, WorksList);
export default compose(worksQuery)(cont);
