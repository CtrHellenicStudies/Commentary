import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import keywordsQuery from '../../../keywords/graphql/queries/list';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// component
import CommentarySearchToolbar from '../../components/CommentarySearchToolbar';

const CommentarySearchToolbarContainer = props => {

	return (
		<CommentarySearchToolbar
		/>
	);
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
	referenceWorksQuery,
	keywordsQuery,
	editionsQuery
)(CommentarySearchToolbarContainer);
