import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { green100, green500, red100, red500, black, fullWhite } from 'material-ui/styles/colors';
import JsDiff from 'diff';

CommentDetail = React.createClass({

	propTypes: {
		comment: React.PropTypes.object.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		addSearchTerm: React.PropTypes.func,
		filters: React.PropTypes.array,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		let selectedRevisionIndex = null;
		let foundRevision = null;
		this.props.filters.forEach((filter) => {
			if (filter.key === 'revision') {
				foundRevision = filter.values[0];
			}
		});
		if (foundRevision != null && foundRevision >= 0 &&
			foundRevision < this.props.comment.revisions.length) {
			selectedRevisionIndex = foundRevision;
		} else {
			selectedRevisionIndex = this.props.comment.revisions.length - 1;
		}

		return {
			selectedRevisionIndex,
			discussionVisible: false,
			lemmaReferenceModalVisible: false,
			lemmaReferenceTop: 0,
			lemmaReferenceLeft: 0,
			lemmaReferenceWork: 'iliad',
			lemmaReferenceSubwork: 0,
			lemmaReferenceLineFrom: 0,
			lemmaReferenceLineTo: null,
			persistentIdentifierModalVisible: false,
			persistentIdentifierModalTop: 0,
			persistentIdentifierModalLeft: 0,
		};
	},

	getMeteorData() {
		const selectedRevision = this.props.comment.revisions[this.state.selectedRevisionIndex];
		return {
			selectedRevision,
		};
	},

	componentDidUpdate() {
		if (!('title' in this.data.selectedRevision)) {
			this.setState({
				selectedRevision: this.props.comment.revisions[this.data.selectedRevisionIndex],
				// selectedRevisionIndex = this.props.comment.revisions.length - 1,
			});
		}
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
			if (part.added) {
				color = green500;
				background = green100;
			} else if (part.removed) {
				color = red500;
				background = red100;
			}
			const span = document.createElement('span');
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

	addSearchTerm(e) {
		if ('addSearchTerm' in this.props) {
			this.props.addSearchTerm(e);
		} else {
			// On home page, go to commentary with this filter selected.
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
		let newHtml = '';
		newHtml = html.replace(/Odyssey (\d+).(\d+)/g,
			"<a href='#' class='has-lemma-reference' data-work='iliad'" +
			" data-subwork='$1'data-lineFrom='$2'>Odyssey $1.$2</a>");
		newHtml = html.replace(/Homeric Hymns (\d+).(\d+)/g,
			"<a href='#' class='has-lemma-reference' data-work='iliad'" +
			" data-subwork='$1' data-lineFrom='$2'>Homeric Hymns $1.$2</a>");
		newHtml = html.replace(/Hymns (\d+).(\d+)/g,
			"<a href='#' class='has-lemma-reference' data-work='iliad'" +
			" data-subwork='$1' data-lineFrom='$2'>Hymns $1.$2</a>");
		newHtml = html.replace(/I.(\d+).(\d+)-(\d+)/g,
			"<a href='#' class='has-lemma-reference' data-work='iliad'" +
			" data-subwork='$1' data-lineFrom='$2' data-lineTo='$3'>I.$1.$2-$3</a>");
		newHtml = html.replace(/O.(\d+).(\d+)-(\d+)/g,
			"<a href='#' class='has-lemma-reference' data-work='iliad'" +
			" data-subwork='$1' data-lineFrom='$2' data-lineTo='$3'>O.$1.$2-$3</a>");

		return { __html: newHtml };
	},

	checkIfToggleLemmaReferenceModal(e) {
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
		const comment = this.props.comment;
		const selectedRevision = this.data.selectedRevision;
		const selectedRevisionIndex = this.state.selectedRevisionIndex;
		let commentClass = 'comment-outer has-discussion ';
		let userCommenterId = [];
		if (Meteor.user()) {
			userCommenterId = Meteor.user().commenterId;
		}
		console.log('userCommenterId', userCommenterId);


		if (self.state.discussionVisible) {
			commentClass += 'discussion--width discussion--visible';
		}

		return (
			<div className={commentClass} >

				<article
					className="comment commentary-comment paper-shadow "
					data-id={comment._id}
					data-commenter-id={comment.commenters[0]._id}
				>
					<div className="comment-fixed-title-wrap paper-shadow">
						<h3 className="comment-fixed-title">{selectedRevision.title}:</h3>
						{/* (commentGroup.selectedLemmaEdition.lines.length) ?
							<p
								className="comment-fixed-lemma lemma-text"
								dangerouslySetInnerHTML={{__html: commentGroup.selectedLemmaEdition
							.lines[0].html}}
								></p>
							: ""*/}

						{/* commentGroup.selectedLemmaEdition.lines.length > 1 ?
							<span className="fixed-title-lemma-ellipsis">&hellip;</span>
						: "" */}

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
							<div className="comment-keywords">
								{comment.keywords.map((keyword, i) => (
									<RaisedButton
										key={i}
										className="comment-keyword paper-shadow"
										onClick={self.addSearchTerm.bind(null, keyword)}
										data-id={keyword._id}
										label={(keyword.title || keyword.wordpressId)}
									/>
								))}
							</div>
						</div>

						<div className="comment-upper-right">
							{comment.commenters.map((commenter, i) => {
								let image = {};
								let imageUrl = '';
								if (commenter.attachment) {
									image = commenter.attachment;
									imageUrl = image.url();
								}
								return (
									<div
										key={i}
										className="comment-author"
									>
										{userCommenterId.indexOf(commenter._id) > -1 ?
											<FlatButton
												label="Edit comment"
												href={`/add-revision/${comment._id}`}
												icon={<FontIcon className="mdi mdi-pen" />}
											/>
											:
											''
										}
										<div className="comment-author-text">
											<a href={`/commenters/${commenter.slug}`} >
												<span className="comment-author-name">{commenter.name}</span>
											</a>
											<span className="comment-date">
												{moment(selectedRevision.created).format('D MMMM YYYY')}
											</span>
										</div>
										<div className="comment-author-image-wrap paper-shadow">
											<a href={`/commenters/${commenter.slug}`}>
												<img
													src={imageUrl.length ? imageUrl : '/images/default_user.jpg'}
													alt="commenter"
												/>
											</a>
										</div>
									</div>
								);
							})}
						</div>

					</div>
					<div className="comment-lower">
						{selectedRevisionIndex === comment.revisions.length - 1 ?
							<div
								className="comment-body"
								dangerouslySetInnerHTML={this.createRevisionMarkup(selectedRevision.text)}
								onClick={this.checkIfToggleLemmaReferenceModal}
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
						<div className="comment-reference" >
							<h4>Secondary Source(s):</h4>
							<p>
								{comment.referenceLink ?
									<a
										href={comment.referenceLink}
										rel="noopener noreferrer"
										target="_blank"
									>
										{comment.reference}
									</a>
									:
									<span >
										{comment.reference}
									</span>
								}
							</p>
						</div>
						{/* <div className="comment-persistent-identifier">
							<a href={"/commentary/?_id=" + comment._id}>
								<span>Persistent Identifier</span>
							</a>
						</div>*/}
						<CommentCitation
							componentClass="comment-citation"
							title="Cite this comment"
							comment={comment}
						/>
					</div>
					<div className="comment-revisions">
						{comment.revisions.map((revision, i) => (
							<FlatButton
								key={i}
								id={i}
								data-id="{revision.id}"
								className="revision selected-revision"
								onClick={self.selectRevision}
								label={`Revision ${moment(revision.created).format('D MMMM YYYY')}`}
							/>
						))}
					</div>

				</article>

				<DiscussionThread
					comment={comment}
					showDiscussionThread={self.showDiscussionThread}
					hideDiscussionThread={self.hideDiscussionThread}
					discussionVisible={self.state.discussionVisible}
				/>
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
			</div>
		);
	},
});
