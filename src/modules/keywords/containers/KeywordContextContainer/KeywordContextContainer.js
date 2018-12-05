import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';


const KeywordContextContainer = props => {
	if (props.commentsQuery.loading ||
		props.editionsQuery.loading ||
		props.textNodesQuery.loading) {
		return;
	}

	const { keyword, maxLines, tenantId } = props;

	let lemmaText = [];
	const context = {};

	if (!keyword) {
		return {
			lemmaText,
			context,
		};
	}

	if (keyword.work && keyword.subwork && keyword.lineFrom
		&& !props.textNodesQuery.variables.workUrn && !props.textNodesQuery.variables.work) {

		context.work = keyword.work.slug;
		context.subwork = keyword.subwork.n;
		context.lineFrom = keyword.lineFrom;
		context.lineTo = keyword.lineTo ? keyword.lineTo : keyword.lineFrom;
		if (!props.textNodesQuery.loading) {
			const textNodesCursor = props.textNodesQuery.textNodes;
			lemmaText = textNodesCursor;
		}
		const properties = Utils.getUrnTextNodesProperties(Utils.createLemmaCitation(
			context.work, context.lineFrom, context.lineTo
		));
		props.textNodesQuery.refetch(properties);
		return;

	} else {
		if (tenantId) {
			const query = {};
			query['keyword._id'] = keyword._id;
			props.commentsQuery.refetch({
				queryParam: JSON.stringify(query),
				limit: 1
			});
		}

		if (props.commentsQuery.comments.length > 0) {
			const comment = props.commentsQuery.comments[0];
			const query = makeKeywordContextQueryFromComment(comment, maxLines); //TODO
			context.work = query.workSlug;
			context.subwork = query.subworkN;
			context.lineFrom = query.lineFrom;
			context.lineTo = query.lineTo;
		}

		const textNodesCursor = props.textNodesQuery.textNodes;
		lemmaText = textNodesCursor;
	}


	return (
		<KeywordContext

		/>
	)
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	editionsQuery,
	commentsQuery,
	textNodesQuery,
)(KeywordContextContainer);
