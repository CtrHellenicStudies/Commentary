import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// components
import CommentEditor from '../../components/CommentEditor/CommentEditor';

// graphql
import referenceWorkCreateMutation from '../../../referenceWorks/graphql/mutations/referenceWorkCreate';
import keywordInsertMutation from '../../../keywords/graphql/mutations/insert';
import keywordUpdateMutation from '../../../keywords/graphql/mutations/update';
import commentsInsertMutation from '../../graphql/mutations/insert';

// lib
import getSelectedLemmaUrn from '../../lib/getSelectedLemmaUrn';
import getSelectOptionsFromCommentFormData from '../../lib/getSelectOptionsFromCommentFormData';
import getNLinesFromLemmaCitation from '../../lib/getNLinesFromLemmaCitation';
import serializeUrn from '../../../cts/lib/serializeUrn';


class CommentEditorContainer extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleSelectWork(urn) {
		console.log(urn);

	}

	render() {
		let commenterOptions = [];
		let referenceWorkOptions = [];
		let keywordOptions = [];

		if (
			this.props.commentersQuery
			&& this.props.commentersQuery.commenters
		) {
			this.props.commentersQuery.commenters.forEach(commenter => {
				commenterOptions.push({
					value: commenter._id,
					label: commenter.name,
					slug: commenter.slug,
				});
			});
		}

		if (
			this.props.referenceWorksQuery
			&& this.props.referenceWorksQuery.referenceWorks
		) {
			this.props.referenceWorksQuery.referenceWorks.forEach(referenceWork => {
				referenceWorkOptions.push({
					value: referenceWork._id,
					label: referenceWork.title,
					slug: referenceWork.slug,
				});
			});
		}

		if (
			this.props.keywordsQuery
			&& this.props.keywordsQuery.keywords
		) {
			this.props.keywordsQuery.keywords.forEach(keyword => {
				keywordOptions.push({
					value: keyword._id,
					label: keyword.title,
					slug: keyword.slug,
				});
			});
		}


		return (
			<CommentEditor
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	referenceWorkCreateMutation,
	keywordInsertMutation,
	keywordUpdateMutation,
	commentsInsertMutation,
	withRouter,
)(CommentEditorContainer);
