import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import Settings from '/imports/api/collections/settings';

// components:
import CommentUpper from '/imports/ui/components/commentary/comments/CommentUpper';
import CommentKeywordsContainer from '/imports/ui/components/commentary/comments/CommentKeywordsContainer';
import CommentLower from '/imports/ui/components/commentary/comments/CommentLower';
import CommentRevisionSelect from '/imports/ui/components/commentary/comments/CommentRevisionSelect';
import DiscussionThread from '/imports/ui/components/discussionComments/DiscussionThread';
import LemmaReferenceModal from '/imports/ui/components/shared/LemmaReferenceModal';
import KeywordReferenceModal from '/imports/ui/components/shared/KeywordReferenceModal/KeywordReferenceModal.js';


/*
	helpers
*/
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
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		return Meteor.user().canEditCommenters;
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
	static propTypes = {
		comment: React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
				_id: React.PropTypes.string.isRequired,
				slug: React.PropTypes.string.isRequired,
				name: React.PropTypes.string.isRequired,
				avatar: React.PropTypes.shape({
					src: React.PropTypes.string.isRequired,
				}),
			})),
			referenceWorks: React.PropTypes.arrayOf(React.PropTypes.shape({
				text: React.PropTypes.string,
				referenceWorkId: React.PropTypes.string,
			})),
			revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
				_id: React.PropTypes.string.isRequired,
				created: React.PropTypes.instanceOf(Date),
				updated: React.PropTypes.instanceOf(Date),
				originalDate: React.PropTypes.instanceOf(Date),
			}))
		}).isRequired,
		filters: React.PropTypes.arrayOf(React.PropTypes.shape({
			key: React.PropTypes.string.isRequired,
			values: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
		})),
		toggleSearchTerm: React.PropTypes.func,
		isOnHomeView: React.PropTypes.bool,
		showLoginModal: React.PropTypes.func,
		toggleLemma: React.PropTypes.func.isRequired,

		// from createContainer:
		referenceWorks: React.PropTypes.arrayOf(React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
		})),
		settings: React.PropTypes.shape({
			discussionCommentsDisabled: React.PropTypes.bool,
		}),
		ready: React.PropTypes.bool,
	};

	static defaultProps = {
		filters: null,
		toggleSearchTerm: null,
		isOnHomeView: false,
		showLoginModal: null,
		referenceWorks: null,
		ready: false,
	};

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
				selectedRevisionIndex = comment.revisions.length - 1;
			}
		}
		return selectedRevisionIndex;
	}

	addSearchTerm(keyword) {
		if (!('isOnHomeView' in this.props) || this.props.isOnHomeView === false) {
			this.props.toggleSearchTerm('keywords', keyword);
		} else {
			FlowRouter.go('/commentary/', {}, { keywords: keyword.slug });
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
			const keyword = $target.data().link.replace('/keywords/', '');
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

		const { comment, referenceWorks, ready } = this.props;
		const { discussionVisible } = this.state;

		if (!ready) {
			return null;
		}

		const selectedRevisionIndex = this.getRevisionIndex();
		const selectedRevision = comment.revisions[selectedRevisionIndex];

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
						commenters={comment.commenters}
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
						onTextClick={this.checkIfToggleReferenceModal}
						referenceWorks={referenceWorks}
					/>

					<CommentRevisionSelect
						commentId={comment._id}
						revisions={comment.revisions}
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
					discussionCommentsDisabled={this.props.settings.discussionCommentsDisabled}
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

/*
	END CommentDetail
*/

export default createContainer(({ comment }) => {

	const tenantId = Session.get('tenantId');

	const handleReferenceWorks = Meteor.subscribe('referenceWorks', tenantId);
	const handleSettings = Meteor.subscribe('settings.tenant', tenantId);

	const referenceWorkIds = [];
	let referenceWorks = [];
	if (comment && 'referenceWorks' in comment) {
		comment.referenceWorks.forEach((referenceWork) => {
			referenceWorkIds.push(referenceWork.referenceWorkId);
		});
		referenceWorks = ReferenceWorks.find({ _id: { $in: referenceWorkIds } }).fetch();
	}

	const settings = Settings.findOne({ tenantId });

	return {
		referenceWorks,
		settings,
		ready: handleReferenceWorks.ready() && handleSettings.ready(),
	};
}, CommentDetail);
