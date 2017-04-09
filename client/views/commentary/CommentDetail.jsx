import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { blue50, blue800, red50, red800, black, fullWhite } from 'material-ui/styles/colors';
import JsDiff from 'diff';
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';
import ReferenceWorks from '/imports/collections/referenceWorks';

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
		const { comment } = this.props;

		let selectedRevisionIndex = null;
		let foundRevision = null;
		this.props.filters.forEach((filter) => {
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

		return {
			selectedRevisionIndex,
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
		const referenceWork = ReferenceWorks.findOne({ _id: comment.referenceId });

		return {
			referenceWork,
			ready: handle.ready(),
		};
	},

	getRevisionDiff() {
		// build the diff view and return a DOM node
		const baseRevision = this.data.selectedRevision;
		const newRevision = this.props.comment.revisions[this.props.comment.revisions.length - 1];
		const revisionDiff = document.createElement('comment-diff');
		const baseRevisionText = this.stripHTMLFromText(baseRevision.text);
		const newRevisionText = this.stripHTMLFromText(newRevision.text);
		const diff = JsDiff.diffWordsWithSpace(baseRevisionText, newRevisionText);
		diff.forEach((part) => {
			// green for additions, red for deletions
			let color = black;
			let background = fullWhite;
			const span = document.createElement('span');

			if (part.added) {
				color = blue800;
				background = blue50;
			} else if (part.removed) {
				color = red800;
				background = red50;
				span.style.textDecoration = 'line-through';
			}

			span.style.color = color;
			span.style.background = background;
			span.style.padding = '0px';

			span.appendChild(document
				.createTextNode(part.value));
			revisionDiff.appendChild(span);
		});

		return revisionDiff;
	},

	stripHTMLFromText(htmlText) {
		const tempElem = document.createElement('div');
		tempElem.innerHTML = htmlText;
		return tempElem.textContent || tempElem.innerText || '';
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

	createRevisionMarkup(html) {
		let newHtml = html;

		const workNamesSpace = [{
			title: 'Iliad',
			slug: 'iliad',
		}, {
			title: 'Odyssey',
			slug: 'odyssey',
		}, {
			title: 'Homeric Hymns',
			slug: 'hymns',
		}, {
			title: 'Hymns',
			slug: 'hymns',
		}];
		const workNamesPeriod = [{
			title: 'Il',
			slug: 'iliad',
		}, {
			title: 'Od',
			slug: 'odyssey',
		}, {
			title: 'HH',
			slug: 'hymns',
		}, {
			title: 'I',
			slug: 'iliad',
		}, {
			title: 'O',
			slug: 'odyssey',
		}];

		let regex1;
		let regex2;

		workNamesSpace.forEach((workName) => {
			// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
			regex1 = new RegExp(`${workName.title} (\\d+).(\\d+)-(\\d+)(?!.*&quot;)`, 'g');

			// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
			regex2 = new RegExp(`${workName.title} (\\d+).(?!\\d+-\\d+)(\\d+)(?!.*&quot;)`, 'g');

			newHtml = newHtml.replace(regex1,
				`<a
					class='has-lemma-reference'
					data-work=${workName.slug}
					data-subwork='$1'
					data-lineFrom='$2'
					data-lineTo='$3'
				>${workName.title} $1.$2-$3</a>`);
			newHtml = newHtml.replace(regex2,
				`<a
					class='has-lemma-reference'
					data-work=${workName.slug}
					data-subwork='$1'
					data-lineFrom='$2'
				>${workName.title} $1.$2</a>`);
		});

		workNamesPeriod.forEach((workName) => {
			// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
			regex1 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(\\d+)-(\\d+)(?!.*&quot;)`, 'g');

			// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
			regex2 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(?!\\d+-\\d+)(\\d+)(?!.*&quot;)`, 'g');
			newHtml = newHtml.replace(regex1,
				`$1<a
					class='has-lemma-reference'
					data-work=${workName.slug}
					data-subwork='$3'
					data-lineFrom='$4'
					data-lineTo='$5'
				>${workName.title}.$2$3.$4-$5</a>`);
			newHtml = newHtml.replace(regex2,
				`$1<a
					class='has-lemma-reference'
					data-work=${workName.slug}
					data-subwork='$3'
					data-lineFrom='$4'
				>${workName.title}.$2$3.$4</a>`);
		});

		return { __html: newHtml };
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

	render() {
		const self = this;
		const { comment } = this.props;
		const { referenceWork, ready } = this.data;
		const { selectedRevisionIndex } = this.state;
		const selectedRevision = comment.revisions[selectedRevisionIndex];

		if (!ready) {
			return null;
		}

		let updated = selectedRevision.updated;
		const format = 'D MMMM YYYY';
		let commentClass = 'comment-outer has-discussion ';
		let userCommenterId = [];
		if (Meteor.user() && Meteor.user().canEditCommenters) {
			userCommenterId = Meteor.user().canEditCommenters;
		}
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
					<div className="comment-fixed-title-wrap paper-shadow">
						<h3 className="comment-fixed-title">{selectedRevision.title}:</h3>
						{comment.commenters.map((commenter, i) => (
							<a
								key={i}
								href={`/commenters/${commenter.slug}`}
							>
								<span className="comment-author-name">
									{commenter.name}
								</span>
							</a>
						))}
					</div>

					<div className="comment-upper">
						<div className="comment-upper-left">
							<h1 className="comment-title">{selectedRevision.title}</h1>
						</div>

						<div className="comment-upper-right">
							{comment.commenters.map((commenter, i) => (
								<div
									key={i}
									className="comment-author"
								>
									{userCommenterId.indexOf(commenter._id) > -1 ?
										<FlatButton
											label="Edit comment"
											href={`/commentary/${comment._id}/edit`}
											icon={<FontIcon className="mdi mdi-pen" />}
										/>
										:
										''
									}
									<div className="comment-author-text">
										<a href={`/commenters/${commenter.slug}`}>
											<span className="comment-author-name">{commenter.name}</span>
										</a>
										<span className="comment-date">
											{moment(updated).format(format)}
										</span>
									</div>
									<div className="comment-author-image-wrap paper-shadow">
										<a href={`/commenters/${commenter.slug}`}>
											<AvatarIcon
												avatar={
													(commenter && 'avatar' in commenter) ?
													commenter.avatar.src
													: null
												}
											/>
										</a>
									</div>
								</div>
							))}
						</div>

					</div>
					<div className="comment-keywords-container">
						<div className="comment-keywords">
							{comment.keywords.map((keyword, i) => {
								if (keyword) {
									return (
										<RaisedButton
											key={i}
											className="comment-keyword paper-shadow"
											onClick={self.addSearchTerm.bind(null, keyword)}
											data-id={keyword._id}
											label={(keyword.title || keyword.wordpressId)}
										/>
									);
								}
								return '';
							})}
						</div>
					</div>
					<div className="comment-lower">
						{selectedRevisionIndex === comment.revisions.length - 1 ?
							<div
								className="comment-body"
								dangerouslySetInnerHTML={this.createRevisionMarkup(selectedRevision.text)}
								onClick={this.checkIfToggleReferenceModal}
							/>
							:
							<div
								id="comment-body"
								className="comment-body"
								dangerouslySetInnerHTML={comment ?
									{ __html: this.getRevisionDiff().innerHTML } : ''}
								onClick={this.checkIfToggleLemmaReferenceModal}
							/>
						}
						{referenceWork ?
							<div className="comment-reference">
								<h4>Secondary Source(s):</h4>
								<p>
									<a
										href={`/referenceWorks/${referenceWork.slug}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										{referenceWork.title}
									</a>
								</p>
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
							referenceWork={referenceWork}
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
