
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired,
    commentGroup: React.PropTypes.object.isRequired,
    addSearchTerm: React.PropTypes.func
  },

  getInitialState(){
    return {
			selectedRevision: {}
    }

  },

	addSearchTerm(e){
		if('addSearchTerm' in this.props){
			this.props.addSearchTerm(e);
		}else {
			// On home page, go to commentary with this filter selected.

		}

	},

	componentDidUpdate(){
		if(!("title" in this.state.selectedRevision)){
			this.setState({
				selectedRevision: this.props.comment.revisions[0]
			});
		}

	},

  render() {
		var self = this;
		var comment = this.props.comment;
		var selectedRevision = this.state.selectedRevision;
		var commentGroup = this.props.commentGroup;


    return (
        <article
					className="comment commentary-comment paper-shadow "
					data-id={comment._id}
					data-commenter-id={comment.commenters[0]._id}>
            <div className="comment-fixed-title-wrap paper-shadow">
                <h3 className="comment-fixed-title">{selectedRevision.title}:</h3>
								{(commentGroup.selectedLemmaEdition.lines.length) ?
	                <p
										className="comment-fixed-lemma lemma-text"
										dangerouslySetInnerHTML={{__html: commentGroup.selectedLemmaEdition
	                .lines[0].html}}
										></p>
									: ""}

								{commentGroup.selectedLemmaEdition.lines.length > 1 ?
									<span className="fixed-title-lemma-ellipsis">&hellip;</span>
								: "" }

								{comment.commenters.map(function(commenter, i){
	                return <a
										key={i}
										href={"/author/" + commenter.slug}
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
														label={keyword.title} />

											 })}
                    </div>
                </div>

                <div className="comment-upper-right">
									{comment.commenters.map(function(commenter, i){
                    return <div
											key={i}
											className="comment-author">
                        <div className="comment-author-text">
                            <a href={"/commenter/" + commenter.slug} >
                                <span className="comment-author-name">{commenter.name}</span>
                            </a>
                            <span className="comment-date">{moment(selectedRevision.created).format('D MMMM YYYY')}</span>
                        </div>
                        <div className="comment-author-image-wrap paper-shadow">
                            <a href={"/commenter/" + commenter.slug}>
                                <img src="/images/default_user.jpg" />
                            </a>
                        </div>
                    </div>
									})}
                </div>

            </div>
            <div className="comment-lower">
                <div
									className="comment-body"
									dangerouslySetInnerHTML={{ __html: selectedRevision.text}}>
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

     );
   }

});
