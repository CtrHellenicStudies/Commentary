import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// component
import AddRevision from '../../components/AddRevision';

// graphql
import commentRemoveMutation from '../../../comments/graphql/mutations/remove';
import commentRemoveRevisionMutation from '../../../comments/graphql/mutations/removeRevision';
import keywordsQuery from '../../../keywords/graphql/queries/list';
import keywordInsertMutation from '../../../keywords/graphql/mutations/insert';
import keywordsUpdate from '../../../keywords/graphql/mutations/update';
import commentersQuery from '../../../commenters/graphql/queries/list';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import referenceWorkCreateMutation from '../../../referenceWorks/graphql/mutations/referenceWorkCreate';


class AddRevisionContainer extends React.Component {

	render() {
		return (
			<AddRevision

			/>
		);
	}
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentRemoveMutation,
	commentersQuery,
	referenceWorksQuery,
	referenceWorkCreateMutation,
	keywordsQuery,
	keywordInsertMutation,
	keywordsUpdate,
	commentRemoveRevisionMutation
)(AddRevisionContainer);
