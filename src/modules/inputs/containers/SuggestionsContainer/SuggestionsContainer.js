import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// component
import Suggestions from '../../components/DraftEditorInput/Suggestions';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';
import keywordsQuery from '../../../keywords/graphql/queries/list';



const SuggestionsContainer = props => {
	let comments = [];
	let keywords = [];

	return (
		<Suggestions
			comments={comments}
			keywords={keywords}
		/>
	);
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});


export default compose(
	connect(mapStateToProps),
	keywordsQuery,
	commentsQuery,
)(SuggestionsContainer);
