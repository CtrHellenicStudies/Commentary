import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// components
import ReferenceWorkPage from '../../components/ReferenceWorkPage';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';


const ReferenceWorkPageContainer = ({ settingsQuery, tenantId }) => {
	let settings = {};

	if (
		settingsQuery
    && settingsQuery.settings
	) {
  	settings = settingsQuery.settings.find(setting => setting.tenantId === tenantId)
	}


	return (
		<ReferenceWorkPage
			settings={settings}
		/>
	);
};


const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});


export default compose(
	connect(mapStateToProps),
	settingsQuery,
)(ReferenceWorkPageContainer);
