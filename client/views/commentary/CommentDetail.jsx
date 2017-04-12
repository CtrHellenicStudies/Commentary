import FlatButton from 'material-ui/FlatButton';
// api:
import ReferenceWorks from '/imports/collections/referenceWorks';  // eslint-disable-line import/no-absolute-path

// layouts:

// components:
import CommentUpper from '/imports/ui/components/commentary/comments/CommentUpper';  // eslint-disable-line import/no-absolute-path
import KeywordsContainer from '/imports/ui/components/commentary/comments/KeywordsContainer';  // eslint-disable-line import/no-absolute-path
import CommentBody from '/imports/ui/components/commentary/comments/CommentBody';  // eslint-disable-line import/no-absolute-path

const getUpdateDate = (selectedRevision) => {
	let updated = selectedRevision.updated;
	if (selectedRevision.originalDate) {
		updated = selectedRevision.originalDate;
	}
	const format = 'D MMMM YYYY';
	return moment(updated).format(format);
};

const getUserCanEditCommenters = () => {
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		return Meteor.user().canEditCommenters;
	}
	return [];
};

CommentDetail = React.createClass({

	propTypes: {
		comment: React.PropTypes.object.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		filters: React.PropTypes.array,
		toggleSearchTerm: React.PropTypes.func,
		isOnHomeView: React.PropTypes.bool,
		showLoginModal: React.PropTypes.func,
		toggleLemma: React.PropTypes.func,
	},

	mixins: [ReactMeteorData],

	getInitialState() {

		return {
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
	},

	getMeteorData() {
		const { comment } = this.props;
		const handle = Meteor.subscribe('referenceWorks', Session.get('tenantId'));
		const referenceWorkIds = [];
		let referenceWorks = [];
		if ('referenceWorks' in comment) {
			comment.referenceWorks.forEach(referenceWork => {
				referenceWorkIds.push(referenceWork.referenceWorkId);
			});
			referenceWorks = ReferenceWorks.find({ _id: { $in: referenceWorkIds } }).fetch();
		}

		return {
			referenceWorks,
			ready: handle.ready(),
		};
	},

	addSearchTerm(keyword) {
		if (!('isOnHomeView' in this.props) || this.props.isOnHomeView === false) {
			this.props.toggleSearchTerm('keywords', keyword);
		} else {
			FlowRouter.go('/commentary/', {}, { keywords: keyword.slug });
		}
	},

	showDiscussionThread() {
		this.setState({
			discussionVisible: true,
		});
	},

	hideDiscussionThread() {
		this.setState({
			discussionVisible: false,
		});
	},

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
				lemmaReferenceLeft: $target.position().left + 160,
			});
		} else if ($target.hasClass('keyword-gloss')) {
			const keyword = $target.data().link.replace('/keywords/', '');
			this.setState({
				keywordReferenceModalVisible: true,
				keywordReferenceTop: $target.position().top - upperOffset,
				keywordReferenceLeft: $target.position().left + 160,
				keyword,
			});
		}
	},

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
	},

	closeKeywordReference() {
		this.setState({
			keywordReferenceModalVisible: false,
			keywordReferenceTop: 0,
			keywordReferenceLeft: 0,
			keyword: '',
		});
	},

	selectRevision(event) {
		this.setState({
			selectedRevisionIndex: parseInt(event.currentTarget.id, 10),
		});
	},

	togglePersistentIdentifierModal(e) {
		const $target = $(e.target);
		this.setState({
			persistentIdentifierModalVisible: !this.state.persistentIdentifierModalVisible,
			persistentIdentifierModalTop: $target.position().top - 34,
			persistentIdentifierModalLeft: $target.position().left,
		});
	},

	closePersistentIdentifierModal() {
		this.setState({
			persistentIdentifierModalVisible: false,
		});
	},

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
	},

	render() {
		const self = this;
		const { comment } = this.props;
		const { referenceWorks, ready } = this.data;
		const selectedRevisionIndex = this.getRevisionIndex();

		if (!ready) {
			return null;
		}

		const selectedRevision = comment.revisions[selectedRevisionIndex];
		let commentClass = 'comment-outer has-discussion ';
		if (self.state.discussionVisible) {
			commentClass += 'discussion--width discussion--visible';
		}

		if (selectedRevision.originalDate) {
			updated = selectedRevision.originalDate;
		}

		return (
			<div className={commentClass}>
				<article
					className="comment commentary-comment paper-shadow "
					data-id={comment._id}
				>

					<CommentUpper
						title={selectedRevision.title}
						commenters={comment.commenters}
						updateDate={getUpdateDate(selectedRevision)}
						userCanEditCommenters={getUserCanEditCommenters()}
					/>

					<KeywordsContainer
						keywords={comment.keywords}
						keywordOnClick={this.addSearchTerm}
					/>

					<div className="comment-lower">
						<CommentBody
							comment={comment}
							revisionIndex={selectedRevisionIndex}
							onTextClick={this.checkIfToggleReferenceModal}
						/>
						{referenceWorks ?
							<div className="comment-reference">
								<h4>Secondary Source(s):</h4>
								<span>
									{referenceWorks.map((referenceWork, i) => {
										const isLast = (i === referenceWorks.length - 1);

										return (
											<span
												key={i}
												className="referenceWork"
											>
												{isLast ? ' ' : ''}
												<a
													href={`/referenceWorks/${referenceWork.slug}`}
													rel="noopener noreferrer"
													target="_blank"
												>
													{referenceWork.title}{isLast ? '' : ','}
												</a>
											</span>
										);
									})}
								</span>
							</div>
						: '' }
					</div>
					<div className="comment-revisions">
						{comment.revisions.map((revision, i) => {
							let format = 'D MMMM YYYY';
							let updated = revision.updated;

							if (revision.originalDate) {
								updated = revision.originalDate;
							}

							return (
								<FlatButton
									key={i}
									id={i}
									data-id={revision.id}
									className={`revision ${selectedRevisionIndex === i ? 'selected-revision' : ''}`}
									onClick={self.selectRevision}
									label={`Revision ${moment(updated).format(format)}`}
								/>
							);
						})}
						<CommentCitation
							componentClass="comment-citation"
							title="Cite this comment"
							comment={comment}
						/>
					</div>

				</article>

				<DiscussionThread
					comment={comment}
					showDiscussionThread={self.showDiscussionThread}
					hideDiscussionThread={self.hideDiscussionThread}
					discussionVisible={self.state.discussionVisible}
					toggleLemma={this.props.toggleLemma}
					showLoginModal={this.props.showLoginModal}
				/>

				{self.state.lemmaReferenceModalVisible ?
					<LemmaReferenceModal
						visible={self.state.lemmaReferenceModalVisible}
						top={self.state.lemmaReferenceTop}
						left={self.state.lemmaReferenceLeft}
						work={self.state.lemmaReferenceWork}
						subwork={self.state.lemmaReferenceSubwork}
						lineFrom={self.state.lemmaReferenceLineFrom}
						lineTo={self.state.lemmaReferenceLineTo}
						closeLemmaReference={self.closeLemmaReference}
					/>
				: ''}

				{self.state.keywordReferenceModalVisible ?
					<KeywordReferenceModal
						visible={self.state.keywordReferenceModalVisible}
						top={self.state.keywordReferenceTop}
						left={self.state.keywordReferenceLeft}
						keyword={self.state.keyword}
						close={self.closeKeywordReference}
					/>
				: ''}
			</div>
		);
	},
});
