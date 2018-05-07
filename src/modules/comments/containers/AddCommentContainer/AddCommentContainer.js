import React, { Component } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import qs from 'qs-lite';
import slugify from 'slugify';
import { withRouter } from 'react-router';

import Header from '../../../../components/navigation/Header/Header';

// components
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';
import AddComment from '../../components/AddComment/AddComment';
import CommentLemmaSelectContainer from '../CommentLemmaSelectContainer';
import CommentWorkSelect from '../../components/CommentWorkSelect';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorkCreateMutation from '../../../referenceWorks/graphql/mutations/referenceWorkCreate';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import keywordsQuery from '../../../keywords/graphql/queries/keywordsQuery';
import keywordInsertMutation from '../../../keywords/graphql/mutations/keywordsInsert';
import keywordUpdateMutation from '../../../keywords/graphql/mutations/keywordsUpdate';
import commentsInsertMutation from '../../graphql/mutations/insert';

// lib
import getSelectedLemmaUrn from '../../lib/getSelectedLemmaUrn';
import getSelectOptionsFromCommentFormData from '../../lib/getSelectOptionsFromCommentFormData';
import getNLinesFromLemmaCitation from '../../lib/getNLinesFromLemmaCitation';
import serializeUrn from '../../../cts/lib/serializeUrn';


class AddCommentContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLemmaCitation: null,
			textNodesUrn: '',
		};

		autoBind(this);
	}

	updateSelectedLemma(selectedLemmaCitation) {
		this.setState({ selectedLemmaCitation });
	}

	handlePagination(textNodesUrn) {

		this.props.updateTextNodesUrn(textNodesUrn);
	}

	async addComment(formData, textValue, textRawValue) {
		// get data for comment:
		const lemmaCitation = getSelectedLemmaUrn(this.state.selectedLemmaCitation);
		lemmaCitation.subreferenceIndexFrom = this.state.selectedLemmaCitation.subreferenceIndexFrom;
		lemmaCitation.subreferenceIndexTo = this.state.selectedLemmaCitation.subreferenceIndexTo;
		const revisionId = Date.now();

		// get keywords after they were created:
		const { keywords, referenceWorks, commenters } = getSelectOptionsFromCommentFormData(formData);

		// create comment object to be inserted:
		const comment = {
			lemmaCitation,
			nLines: getNLinesFromLemmaCitation(lemmaCitation),
			revisions: [{
				_id: revisionId.valueOf(),
				title: formData.titleValue,
				text: textValue,
				textRaw: textRawValue,
				created: referenceWorks ? referenceWorks.date : new Date(),
				slug: slugify(formData.titleValue),
			}],
			commenters,
			keywords,
			referenceWorks,
			tenantId: sessionStorage.getItem('tenantId'),
			status: 'publish',
		};

		const res = await this.props.commentInsert(comment);

		if (res.data.commentInsert._id) {
			const urlParams = qs.stringify({_id: res.data.commentInsert._id});
			this.props.history.push(`/commentary?${urlParams}`);
		} else {
			this.props.history.push(`/`);
		}
	}

	selectWork(urn) {
		console.log(urn);

	}

	render() {

		const { selectedLemmaCitation, contextReaderOpen, textNodesUrn } = this.state;

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
			<div>
				<Header
					toggleSearchTerm={() => {}}
					handlePagination={this.handlePagination}
					initialSearchEnabled
					addCommentPage
				/>
				<main>
					<div className="commentary-comments">
						<div className="comment-group">
							<CommentWorkSelect
								selectWork={this.selectWork}
							/>

							{(selectedLemmaCitation && 'passageFrom' in selectedLemmaCitation) ?
								<CommentLemmaSelectContainer
									selectedLemmaCitation={selectedLemmaCitation}
									textNodesUrn={serializeUrn(getSelectedLemmaUrn(selectedLemmaCitation))}
							  />
							:
							''}

							<AddComment
								addComment={this.addComment}
								commenterOptions={commenterOptions}
								referenceWorkOptions={referenceWorkOptions}
								keywordOptions={keywordOptions}
								referenceWorkCreate={this.props.referenceWorkCreate}
								keywordInsert={this.props.keywordInsert}
								keywordUpdate={this.props.keywordUpdate}
						  />
						</div>

						<ContextPanel
							open={contextReaderOpen}
							selectedLemmaCitation={selectedLemmaCitation}
							updateSelectedLemma={this.updateSelectedLemma}
							textNodesUrn={textNodesUrn}
							editor
					  />
					</div>
				</main>
			</div>
		);
	}
}

AddCommentContainer.props = {
	selectedTextNodes: PropTypes.object,
	textNodesQuery: PropTypes.func
};

export default compose(
	commentersQuery,
	referenceWorkCreateMutation,
	referenceWorksQuery,
	keywordsQuery,
	keywordInsertMutation,
	keywordUpdateMutation,
	commentsInsertMutation,
	withRouter,
)(AddCommentContainer);
