import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import $ from 'jquery';
import moment from 'moment';

import qs from 'qs-lite';
import { compose } from 'react-apollo';

// graphql
import { referenceWorksQuery } from '../../../../../graphql/methods/referenceWorks';
import { settingsQuery } from '../../../../../graphql/methods/settings';

// components:
import CommentUpper from './CommentUpper';
import CommentKeywordsContainer from './CommentKeywordsContainer';
import CommentLower from './commentLower/CommentLower';
import CommentRevisionSelect from './CommentRevisionSelect';
import DiscussionThread from './DiscussionThread';
import LemmaReferenceModal from './LemmaReferenceModal';
import KeywordReferenceModal from '../../../../keywords/KeywordReferenceModal';


/*
	helpers
*/
import { sortRevisions } from './helpers';

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
	const user = Cookies.getItem('user');
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
			lemmaReferenceWork: 'iliad',
			lemmaReferenceSubwork: 0,
			lemmaReferenceLineFrom: 0,
			lemmaReferenceLineTo: null,
			keyword: '',
			persistentIdentifierModalVisible: false,
			persistentIdentifierModalTop: 0,
			persistentIdentifierModalLeft: 0,
			searchTerm: ''
		};
		// methods:
		this.getRevisionIndex = this.getRevisionIndex.bind(this);
		this.addSearchTerm = this.addSearchTerm.bind(this);
		this.showDiscussionThread = this.showDiscussionThread.bind(this);
		this.hideDiscussionThread = this.hideDiscussionThread.bind(this);
		this.checkIfToggleReferenceModal = this.checkIfToggleReferenceModal.bind(this);
		this.closeLemmaReference = this.closeLemmaReference.bind(this);
		this.closeKeywordReference = this.closeKeywordReference.bind(this);
		this.selectRevision = this.selectRevision.bind(this);

	}

	componentWillReceiveProps(nextProps) {
		const { filters } = this.props;
		const { searchTerm } = this.state;

		const tenantId = sessionStorage.getItem('tenantId');
		const { comment } = nextProps;

		const referenceWorkIds = [];
		let referenceWorks = [];

		if (comment && comment.referenceWorks && !nextProps.referenceWorksQuery.loading) {
			comment.referenceWorks.forEach((referenceWork) => {
				referenceWorkIds.push(referenceWork.referenceWorkId);
			});
			referenceWorks = nextProps.referenceWorksQuery.referenceWorks.filter(x => referenceWorkIds.find(y => x._id === y) !== undefined && x.tenantId === tenantId);
		}
	
		const settings = nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === tenantId);
	
		const user = Cookies.getItem('user');
		const ready = !nextProps.referenceWorksQuery.loading && !nextProps.settingsQuery.loading;

		this.setState({
			settings: settings,
			user: user,
			ready: ready,
			referenceWorks: referenceWorks
		});
		if (filters.find(filter => filter.key === 'textsearch') !== searchTerm && filters && filters.find(filter => filter.key === 'textsearch')) {
			const searchTermsObject = filters.find(filter => filter.key === 'textsearch');
			this.setState({
				searchTerm: searchTermsObject.values[0]
			});
		}
	}

	getRevisionIndex() {
		const { comment, filters } = this.props;
		let selectedRevisionIndex = this.state.selectedRevisionIndex;
		if (selectedRevisionIndex === null) {
			let foundRevision = null;
			filters.forEach((filter) => {
				if (filter.key === 'revision') {
					foundRevision = filter.values[0];
				}
			});

			if (foundRevision != null && foundRevision >= 0 &&
				foundRevision < comment.revisions.length) {
				selectedRevisionIndex = foundRevision;
			} else {
				selectedRevisionIndex = 0;
			}
		}
		return selectedRevisionIndex;
	}

	addSearchTerm(keyword) {
		if (!(this.props.isOnHomeView) || this.props.isOnHomeView === false) {
			this.props.toggleSearchTerm('keywords', keyword);
		} else {
			const urlParams = qs.stringify({ keywords: keyword.slug });
			this.props.history.push(`/commentary/${urlParams}`);
		}
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
			lemmaReferenceWork: 'iliad',
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

		const { comment } = this.props;
		const { discussionVisible, searchTerm, referenceWorks, ready, settings } = this.state;

		if (!ready) {
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
						commenters={this.props.commenters}
						updateDate={getUpdateDate(selectedRevision)}
						userCanEditCommenters={getUserCanEditCommenters()}
					/>

					<CommentKeywordsContainer
						keywords={comment.keywords}
						keywordOnClick={this.addSearchTerm}
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
					toggleLemma={this.props.toggleLemma}
					showLoginModal={this.props.showLoginModal}
					discussionCommentsDisabled={settings.discussionCommentsDisabled}
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
	filters: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		values: PropTypes.arrayOf(PropTypes.any).isRequired,
	})),
	history: PropTypes.object,
	commenters: PropTypes.object,
	toggleSearchTerm: PropTypes.func,
	isOnHomeView: PropTypes.bool,
	showLoginModal: PropTypes.func,
	toggleLemma: PropTypes.func.isRequired,
	referenceWorksQuery: PropTypes.object,
	settingsQuery: PropTypes.object,
};
CommentDetail.defaultProps = {
	filters: null,
	toggleSearchTerm: null,
	isOnHomeView: false,
	showLoginModal: null,
	referenceWorks: null,
	ready: false,
};
/*
	END CommentDetail
*/
export default compose(
	referenceWorksQuery,
	settingsQuery
)(CommentDetail);
