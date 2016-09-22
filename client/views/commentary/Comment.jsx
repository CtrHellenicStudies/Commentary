
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Comment = React.createClass({

	propTypes: {
		comment: React.PropTypes.object.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		addSearchTerm: React.PropTypes.func,
	},

	getInitialState(){
		return {
			selectedRevision: {},
			discussionVisible: false
		}

	},

	addSearchTerm(e){
		if('addSearchTerm' in this.props){
			this.props.addSearchTerm(e);
		}else {
			// On home page, go to commentary with this filter selected.

		}

	},

	componentDidMount(){
		if(!("title" in this.state.selectedRevision)){
			this.setState({
				selectedRevision: this.props.comment.revisions[0]
			});
		}

	},

	showDiscussionThread(comment){
		this.setState({
			discussionVisible: true,
		});

	},

	hideDiscussionThread(){
		this.setState({
			discussionVisible: false,
		});

	},

	createRevisionMarkup(html){
		//comment.selected_revision.text = comment.selected_revision.text.replace(/Iliad (\d+).(\d+)/g, "<a href='#' class='has-lemma-reference' data-work='iliad' data-subwork='$1' data-line_from='$2'>Iliad $1.$2</a>");

		return { __html: html };

	},


	render() {
		var self = this;
		var comment = this.props.comment;
		var selectedRevision = this.state.selectedRevision;
		var commentGroup = this.props.commentGroup;
		var commentClass = "comment-outer has-discussion ";

		if(self.state.discussionVisible){
			commentClass += "discussion--width discussion--visible";
		}

		return (<div
				className={commentClass}
				>

				<article
					className="comment commentary-comment paper-shadow "
					data-id={comment._id}
					data-commenter-id={comment.commenters[0]._id}>
						<div className="comment-fixed-title-wrap paper-shadow">
								<h3 className="comment-fixed-title">{selectedRevision.title}:</h3>
								{/*(commentGroup.selectedLemmaEdition.lines.length) ?
									<p
										className="comment-fixed-lemma lemma-text"
										dangerouslySetInnerHTML={{__html: commentGroup.selectedLemmaEdition
									.lines[0].html}}
										></p>
									: ""*/}

								{/*commentGroup.selectedLemmaEdition.lines.length > 1 ?
									<span className="fixed-title-lemma-ellipsis">&hellip;</span>
								: "" */}

								{comment.commenters.map(function(commenter, i){
									return <a
										key={i}
										href={"/commenters/" + commenter.slug}
										>
										<span className="comment-author-name">
											{commenter.name}
										</span>
									</a>

								})}

						</div>

						<div className="comment-upper">

								<div className="comment-upper-left">
										<h1 className="comment-title">{selectedRevision.title}</h1>
										<div className="comment-keywords">
											{comment.keywords.map(function(keyword, i){
													return <RaisedButton
																	key={i}
																	className="comment-keyword paper-shadow"
																	onClick={self.addSearchTerm}
																	data-id={keyword._id}
																	label={(keyword.title || keyword.wordpressId)}
																/>

											 })}
										</div>
								</div>

								<div className="comment-upper-right">
									{comment.commenters.map(function(commenter, i){
										let image = {};
										let imageUrl = "";
										if (commenter.attachment) {
											image = commenter.attachment;
											imageUrl = image.url();
										}
										return <div
											key={i}
											className="comment-author">
											<div className="comment-author-text">
												<a href={"/commenters/" + commenter.slug} >
													<span className="comment-author-name">{commenter.name}</span>
												</a>
												<span className="comment-date">{moment(selectedRevision.created).format('D MMMM YYYY')}</span>
											</div>
											<div className="comment-author-image-wrap paper-shadow">
												<a href={"/commenters/" + commenter.slug}>
													<img src={imageUrl.length ? imageUrl : "/images/default_user.jpg"} />
												</a>
											</div>
										</div>
									})}
								</div>

						</div>
						<div className="comment-lower">
							<div
								className="comment-body"
								dangerouslySetInnerHTML={this.createRevisionMarkup(selectedRevision.text)}>
							</div>
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
							<div className="comment-persistent-identifier">
								<a href={"/commentary/?_id=" + comment._id}>
									<span>Persistent Identifier</span>
								</a>
							</div>
						</div>
						<div className="comment-revisions">
							{comment.revisions.map(function(revision, i){
								return <FlatButton
									key={i}
									data-id="{revision.id}"
									className="revision selected-revision"
									onClick={this.selectRevision}
									label={"Revision " + moment(revision.updated).format('D MMMM YYYY')}
									>

								</FlatButton>

							})}
						</div>

				</article>

				<DiscussionThread
					comment={comment}
					showDiscussionThread={self.showDiscussionThread}
					hideDiscussionThread={self.hideDiscussionThread}
					discussionVisible={self.state.discussionVisible}
					/>


			</div>

		 );
	 }

});
