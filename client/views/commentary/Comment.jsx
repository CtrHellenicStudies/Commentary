import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import diffview from 'jsdifflib';

Comment = React.createClass({

	propTypes: {
		comment: React.PropTypes.object.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		addSearchTerm: React.PropTypes.func,
	},

	getInitialState() {
		return {
			selectedRevisionIndex: this.props.comment.revisions.length - 1,
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

	mixins: [ReactMeteorData],

	getMeteorData() {
		const selectedRevision = this.props.comment.revisions[this.state.selectedRevisionIndex];
        																				return {
        										selectedRevision,
        };
    										},

	addSearchTerm(e) {
		if ('addSearchTerm' in this.props) {
			this.props.addSearchTerm(e);
		} else {
			// On home page, go to commentary with this filter selected.

		}
	},

	componentDidUdate() {
		if (!('title' in this.state.selectedRevision)) {
			this.setState({
				selectedRevision: this.props.comment.revisions[this.state.selectedRevisionIndex],
				// selectedRevisionIndex = this.props.comment.revisions.length - 1,
			});
		}
	},

	showDiscussionThread(comment) {
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
		if (!html) {
			html = '';
		}

		html = html.replace(/Iliad (\d+).(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2'>Iliad $1.$2</a>");
		html = html.replace(/Odyssey (\d+).(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2'>Odyssey $1.$2</a>");
		html = html.replace(/Homeric Hymns (\d+).(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2'>Homeric Hymns $1.$2</a>");
		html = html.replace(/Hymns (\d+).(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2'>Hymns $1.$2</a>");
		html = html.replace(/I.(\d+).(\d+)-(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2' data-lineTo='$3'>I.$1.$2-$3</a>");
		html = html.replace(/O.(\d+).(\d+)-(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-lineFrom='$2' data-lineTo='$3'>O.$1.$2-$3</a>");


		return { __html: html };
	},

	checkIfToggleLemmaReferenceModal(e) {
		const $target = $(e.target);
		let upperOffset = 90;
		let lineFrom = 0;
		let lineTo = 0;
		let subwork = 0;

		if ($target.hasClass('has-lemma-reference')) {
			subwork = parseInt($target.data().subwork);
			lineFrom = parseInt($target.data().linefrom);
			lineTo = parseInt($target.data().lineto);

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
            										selectedRevisionIndex: parseInt(event.currentTarget.id),
        });
    										},


	handleEditCommentClick(id) {
		FlowRouter.go('/add-revision/' + id);
	},

	getDiff() {
        // build the diff view and return a DOM node
        																const baseRevision = this.data.selectedRevision;
        																const newRevision = this.props.comment.revisions[this.props.comment.revisions.length - 1];
        																				return diffview.buildView({
            										baseText: baseRevision.text,
            										newText: newRevision.text,
            // set the display titles for each resource
            										baseTextName: 'Revision ' + moment(baseRevision.created).format('D MMMM YYYY'),
            										newTextName: 'Revision ' + moment(newRevision.created).format('D MMMM YYYY'),
            										contextSize: null,
            // set inine to true if you want inline
            // rather than side by side diff
            										inline: true,
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
		const commentGroup = this.props.commentGroup;
		let commentClass = 'comment-outer has-discussion ';
		var userCommenterId = 'no commenter';
		if (Meteor.userId()) {
			var userCommenterId = Meteor.user().commenterId;
		}


		if (self.state.discussionVisible) {
			commentClass += 'discussion--width discussion--visible';
		}

		return (<div
			className={commentClass}
  >

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

								{comment.commenters.map(function (commenter, i) {
									return (<a
										key={i}
										href={'/commenters/' + commenter.slug}
         >
										<span className="comment-author-name">
											{commenter.name}
										</span>
									</a>);
								})}

						</div>

						<div className="comment-upper">

								<div className="comment-upper-left">
									<h1 className="comment-title">{selectedRevision.title}</h1>
									<div className="comment-keywords">
										{comment.keywords.map(function (keyword, i) {
											return (<RaisedButton
												key={i}
												className="comment-keyword paper-shadow"
												onClick={self.addSearchTerm.bind(null, keyword)}
												data-id={keyword._id}
												label={(keyword.title || keyword.wordpressId)}
           />);
										 })}
									</div>
								</div>

								<div className="comment-upper-right">
									{comment.commenters.map(function (commenter, i) {
										let image = {};
										let imageUrl = '';
										if (commenter.attachment) {
											image = commenter.attachment;
											imageUrl = image.url();
										}
										return (<div
											key={i}
											className="comment-author"
          >
											{userCommenterId === commenter._id ?
												<FlatButton
													label="Edit comment"
													onClick={self.handleEditCommentClick.bind(null, comment._id)}
													icon={<FontIcon className="mdi mdi-pen" />}
												/>
												:
												''
											}
											<div className="comment-author-text">
												<a href={'/commenters/' + commenter.slug} >
													<span className="comment-author-name">{commenter.name}</span>
												</a>
												<span className="comment-date">{moment(selectedRevision.created).format('D MMMM YYYY')}</span>
											</div>
											<div className="comment-author-image-wrap paper-shadow">
												<a href={'/commenters/' + commenter.slug}>
													<img src={imageUrl.length ? imageUrl : '/images/default_user.jpg'} />
												</a>
											</div>
										</div>);
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
									className="comment-body"
									dangerouslySetInnerHTML={comment ? { __html: '<table class=\'table-diff\'>' + this.getDiff().innerHTML + '</table>' } : ''}
									onClick={this.checkIfToggleLemmaReferenceModal}
								/>
							}
							<div className="comment-reference" >
								<h4>Secondary Source(s):</h4>
								<p>
									{comment.referenceLink ?
										<a href={comment.referenceLink} target="_blank" >
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
							{comment.revisions.map(function (revision, i) {
								return (<FlatButton
									key={i}
									id={i}
									data-id="{revision.id}"
									className="revision selected-revision"
									onClick={self.selectRevision}
									label={'Revision ' + moment(revision.created).format('D MMMM YYYY')}
        />);
							})}
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
