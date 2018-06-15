import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';


const HomeContainer = ({ settingsQuery }) => {
	let settings = null;

	if (
		settingsQuery
    && settingsQuery.settings
	) {
		settings = settingsQuery.settings;
	}

	return (
		<Home
			settings={settings}
		/>
	);
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
)(HomeContainer);
