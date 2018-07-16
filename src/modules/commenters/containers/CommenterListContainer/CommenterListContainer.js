import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import commentersQuery from '../../graphql/queries/commenters';


const CommenterListContainer = props => {
	let commenters = [];

	return (
		<CommenterList
			commenters={commenters}
		/>
	);
};


const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
)(CommenterListContainer);
