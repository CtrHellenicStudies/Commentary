import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// component
import Home from '../../components/Home';


const HomeContainer = ({ settingsQuery, tenantId }) => {
	let settings = null;

	if (
		settingsQuery
    && settingsQuery.settings
	) {
		settings = settingsQuery.loading ? {} : settingsQuery.settings.find(x => x.tenantId === tenantId);
	}

	if (!settings) {
		return null;
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
