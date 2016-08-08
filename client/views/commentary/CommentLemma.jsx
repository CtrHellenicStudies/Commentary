
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

CommentLemma = React.createClass({

  propTypes: {
    commentGroup: React.PropTypes.object.isRequired
  },

  getInitialState(){
		return {}

  },

  render() {
		var commentGroup = this.props.commentGroup;
		console.log("CommentLemma.commentGroup:", commentGroup);

    return (

      <div className="comment-outer comment-lemma-comment-outer">

          <div className="comment-group-meta">
              <div className="comment-group-meta-inner">
                  <div className="comment-group-ref">
                      <span className="comment-group-ref-above">
                          {commentGroup.work.title} {commentGroup.subwork.title}
                      </span>
                      <h2 className="comment-group-ref-below">
												{commentGroup.lineFrom}{commentGroup.lineTo ? "-" + commentGroup.lineTo : "" }
											</h2>

                  </div>
                  <div className="comment-group-commenters">

											{commentGroup.commenters.map(function(commenter, i){

	                      return <div
													key={i}
													className="comment-author"
													data-commenter-id={commenter.id}>
	                          <span className="comment-author-name">
															{commenter.name}
														</span>
	                          <div
															className="comment-author-image-wrap paper-shadow"
															>
	                              <a
																	href="#"
																	onClick={this.goToAuthorComment}
																	>
	                                  <img src="/images/default_user.jpg" />
	                              </a>

	                          </div>
	                      </div>
											})}

                  </div>
              </div>

          </div>

          <article className="comment lemma-comment paper-shadow">

							{commentGroup.selectedLemmaEdition.lines.map(function(lemma, i){
	              return <p
													key={i}
													className="lemma-text"
													dangerouslySetInnerHTML={{ __html: lemma.html}}
													></p>

							})}
              <div className="edition-tabs tabs">
								{commentGroup.lemmaText.map(function(lemmaTextEdition){
                  <RaisedButton
										data-edition={lemmaTextEdition.title}
										className="edition-tab tab selected_edition"
										onClick={this.toggleEdition}>
                      {lemmaTextEdition.title}
                  </RaisedButton>

								})}
              </div>
              <div className="context-tabs tabs">
                  <RaisedButton
										className="context-tab tab"
										onClick={this.showLemmaPanel}
										label="Context"
										labelPosition="before"
	                  icon={<FontIcon className="mdi mdi-chevron-right" />}
										>
                  </RaisedButton>
              </div>
          </article>
          <div className="discussion-wrap">
          </div>
      </div>


     );
   }

});
