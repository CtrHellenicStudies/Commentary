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

// lib
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';


const CommentarySearchToolbarContainer = props => {
	const subdomain = getCurrentSubdomain();
	let works = [];
	let commenters = [];
	let words = [];
	let ideas = [];
	let referenceWorks = [];

	// TODO move static works list for tenant to db with admin settings page
	if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
		works = defaultWorksEditions[subdomain].works;
	}

	// commenters
	if (props.commentersQuery && props.commentersQuery.commenters) {
		commenters = props.commentersQuery.commenters;
	}

	// keywords/ideas
	if (props.keywordsQuery && props.keywordsQuery.keywords) {
		props.keywordsQuery.keywords.forEach(keyword => {
			if (keyword.type === 'word') {
				words.push(keyword);
			} else {
				ideas.push(keyword);
			}
		});
	}

	// reference works
	if (props.referenceWorksQuery && props.referenceWorksQuery.referenceWorks) {
		referenceWorks = props.referenceWorksQuery.referenceWorks;
	}


	return (
		<CommentarySearchToolbar
			works={works}
			commenters={commenters}
			words={words}
			ideas={ideas}
			referenceWorks={referenceWorks}
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
