import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import $ from 'jquery';
import moment from 'moment';
import autoBind from 'react-autobind';

// components
import CommentUpper from './CommentUpper';
import CommentKeywords from './CommentKeywords';
import CommentLower from './CommentLower';
import CommentRevisionSelect from './CommentRevisionSelect';
import DiscussionThread from '../../../discussionComments/containers/DiscussionThreadContainer';
import LemmaReferenceModal from '../LemmaReferenceModal';
import KeywordReferenceModal from '../../../keywords/components/KeywordReferenceModal';

// lib
import sortRevisions from '../../lib/sortRevisions';


const getUpdateDate = (selectedRevision) => {
	let updated = selectedRevision.created;
	if (selectedRevision.originalDate) {
		updated = selectedRevision.originalDate;
	} else if (selectedRevision.updated) {
		updated = selectedRevision.originalDate;
	}
	return moment(updated).format('D MMMM YYYY');
};

const getUserCanEditCommenters = () => {
	const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
	if (user && user.canEditCommenters) {
		return user.canEditCommenters;
	}
	return [];
};

const getCommentClass = (discussionVisible) => {
	let commentClass = 'comment-outer has-discussion ';
	if (discussionVisible) {
		commentClass += 'discussion--width discussion--visible';
	}
	return commentClass;
};


/*
	BEGIN CommentDetail
*/
class CommentDetail extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedRevisionIndex: null,
			discussionVisible: false,
			lemmaReferenceModalVisible: false,
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			lemmaReferenceWork: '001',
			lemmaReferenceSubwork: 0,
			lemmaReferenceLineFrom: 0,
			lemmaReferenceLineTo: null,
			keyword: '',
			persistentIdentifierModalVisible: false,
			persistentIdentifierModalTop: 0,
			persistentIdentifierModalLeft: 0,
			searchTerm: ''
		};

		autoBind(this);
	}

	getRevisionIndex() {
		const { comment } = this.props;
		let selectedRevisionIndex = this.state.selectedRevisionIndex;

		if (selectedRevisionIndex === null) {
			let foundRevision = null;

			if (foundRevision != null && foundRevision >= 0 &&
				foundRevision < comment.revisions.length) {
				selectedRevisionIndex = foundRevision;
			} else {
				selectedRevisionIndex = 0;
			}
		}
		return selectedRevisionIndex;
	}

	showDiscussionThread() {
		this.setState({
			discussionVisible: true,
		});
	}

	hideDiscussionThread() {
		this.setState({
			discussionVisible: false,
		});
	}

	checkIfToggleReferenceModal(e) {
		const $target = $(e.target);
		let upperOffset = 90;
		let lineFrom = 0;
		let lineTo = 0;
		let subwork = 0;

		if ($target.hasClass('has-lemma-reference')) {
			subwork = parseInt($target.data().subwork, 10);
			lineFrom = parseInt($target.data().linefrom, 10);
			lineTo = parseInt($target.data().lineto, 10);

			if (lineTo) {
				upperOffset += ((lineTo - lineFrom) * 60);
				if (upperOffset > 260) {
					upperOffset = 260;
				}
			}

			this.setState({
				lemmaReferenceModalVisible: true,
				lemmaReferenceWork: $target.data().work,
				lemmaReferenceSubwork: subwork,
				lemmaReferenceLineFrom: lineFrom,
				lemmaReferenceLineTo: lineTo,
				lemmaReferenceTop: $target.position().top - upperOffset,
				lemmaReferenceLeft: $target.position().left + 0,
			});
		} else if ($target.hasClass('keyword-gloss')) {
			const keyword = $target.data().link.replace('/tags/', '');
			this.setState({
				keywordReferenceModalVisible: true,
				keywordReferenceTop: $target.position().top - upperOffset,
				keywordReferenceLeft: $target.position().left + 0,
				keyword,
			});
		}
	}

	closeLemmaReference() {
		this.setState({
			lemmaReferenceModalVisible: false,
			lemmaReferenceWork: '001',
			lemmaReferenceSubwork: 0,
			lemmaReferenceLineFrom: 0,
			lemmaReferenceLineTo: null,
			lemmaReferenceTop: 0,
			lemmaReferenceLeft: 0,
		});
	}

	closeKeywordReference() {
		this.setState({
			keywordReferenceModalVisible: false,
			keywordReferenceTop: 0,
			keywordReferenceLeft: 0,
			keyword: '',
		});
	}

	selectRevision(event) {
		this.setState({
			selectedRevisionIndex: parseInt(event.currentTarget.id, 10),
		});
	}
	render() {

		const { comment, commenters, toggleLemma, showLoginModal } = this.props;
		const { discussionVisible, searchTerm, referenceWorks } = this.state;

		if (!comment) {
			// TODO: handle loading for component
			return null;
		}

		const selectedRevisionIndex = this.getRevisionIndex();
		const revisions = sortRevisions(comment.revisions);
		const selectedRevision = revisions[selectedRevisionIndex];
		const commentClass = getCommentClass(discussionVisible);

		return (
			<div className={commentClass}>
				<article
					className="comment commentary-comment paper-shadow"
					data-id={comment._id}
				>
					<CommentUpper
						title={selectedRevision.title}
						commentId={comment._id}
						commenters={commenters}
						updateDate={getUpdateDate(selectedRevision)}
						userCanEditCommenters={getUserCanEditCommenters()}
					/>

					<CommentKeywords
						keywords={comment.keywords}
					/>

					<CommentLower
						comment={comment}
						revisionIndex={selectedRevisionIndex}
						selectedRevision={selectedRevision}
						onTextClick={this.checkIfToggleReferenceModal}
						referenceWorks={referenceWorks}
						searchTerm={searchTerm}
					/>

					<CommentRevisionSelect
						commentId={comment._id}
						revisions={revisions}
						comment={comment}
						selectedRevisionIndex={selectedRevisionIndex}
						selectRevision={this.selectRevision}
					/>

				</article>

				<DiscussionThread
					comment={comment}
					showDiscussionThread={this.showDiscussionThread}
					hideDiscussionThread={this.hideDiscussionThread}
					discussionVisible={this.state.discussionVisible}
					toggleLemma={toggleLemma}
					showLoginModal={showLoginModal}
					discussionCommentsDisabled={true}
				/>

				{this.state.lemmaReferenceModalVisible ?
					<LemmaReferenceModal
						visible={this.state.lemmaReferenceModalVisible}
						top={this.state.lemmaReferenceTop}
						left={this.state.lemmaReferenceLeft}
						work={this.state.lemmaReferenceWork}
						subwork={this.state.lemmaReferenceSubwork}
						lineFrom={this.state.lemmaReferenceLineFrom}
						lineTo={this.state.lemmaReferenceLineTo}
						closeLemmaReference={this.closeLemmaReference}
					/>
					: ''}

				{this.state.keywordReferenceModalVisible ?
					<KeywordReferenceModal
						visible={this.state.keywordReferenceModalVisible}
						top={this.state.keywordReferenceTop}
						left={this.state.keywordReferenceLeft}
						keyword={this.state.keyword}
						close={this.closeKeywordReference}
					/>
					: ''}
			</div>
		);
	}
}

CommentDetail.propTypes = {
	comment: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		commenters: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			avatar: PropTypes.shape({
				src: PropTypes.string.isRequired,
			}),
		})),
		referenceWorks: PropTypes.arrayOf(PropTypes.shape({
			text: PropTypes.string,
			referenceWorkId: PropTypes.string,
		})),
		revisions: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			created: PropTypes.instanceOf(Date),
			updated: PropTypes.instanceOf(Date),
			originalDate: PropTypes.instanceOf(Date),
		})),
		urn: PropTypes.object,
	}).isRequired,
	history: PropTypes.object,
	commenters: PropTypes.object,
	isOnHomeView: PropTypes.bool,
	showLoginModal: PropTypes.func,
	toggleLemma: PropTypes.func.isRequired,
	referenceWorksQuery: PropTypes.object,
};

CommentDetail.defaultProps = {
	isOnHomeView: false,
	showLoginModal: null,
	referenceWorks: null,
	ready: false,
};

/*
	END CommentDetail
*/

export default CommentDetail;
