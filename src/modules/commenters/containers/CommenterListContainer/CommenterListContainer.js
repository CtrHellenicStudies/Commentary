import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import commentersQuery from '../../graphql/queries/list';

// component
import CommenterList from '../../components/CommenterList';


const CommenterListContainer = props => {
	let commenters = [];

	if (
		props.commentersQuery
		&& props.commentersQuery.commenters
	) {
		commenters = props.commentersQuery.commenters
		if (props.featureOnHomepage) {
			 commenters = commenters.filter(commenter => (
				commenter.featureOnHomepage === true
			));
		}
	}

	return (
		<CommenterList
			{...props}
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
