
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

CommentLemma = React.createClass({

  propTypes: {
    commentGroup: React.PropTypes.object.isRequired,
    showLemmaPanel: React.PropTypes.func.isRequired
  },

  getInitialState(){
		return {
			selectedLemmaEdition: {lines:[]}

		}

  },

	componentDidUpdate(){
		console.log(this.props.commentGroup);
		if(this.props.commentGroup.lemmaText.length && this.state.selectedLemmaEdition.lines.length === 0){
			this.setState({
				selectedLemmaEdition: this.props.commentGroup.lemmaText[0]
			});
		}

	},

	toggleEdition(editionSlug){
		if(this.state.selectedLemmaEdition.slug !== editionSlug){
			var newSelectedEdition = {};
			this.props.commentGroup.lemmaText.forEach(function(edition){
					if(edition.slug === editionSlug){
						newSelectedEdition = edition;
					}
			});

			this.setState({
				selectedLemmaEdition: newSelectedEdition
			});

		}

	},

	showLemmaPanel(commentGroup){
		this.props.showLemmaPanel(commentGroup);
	},

  render() {
		var self = this;
		var commentGroup = this.props.commentGroup;

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
																	onClick={self.goToAuthorComment}
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

							{this.state.selectedLemmaEdition.lines.map(function(line, i){
	              return <p
													key={i}
													className="lemma-text"
													dangerouslySetInnerHTML={{ __html: line.html}}
													></p>

							})}
              <div className="edition-tabs tabs">
								{commentGroup.lemmaText.map(function(lemmaTextEdition, i){
                  return <RaisedButton
										key={i}
										label={lemmaTextEdition.title}
										data-edition={lemmaTextEdition.title}
										className={self.state.selectedLemmaEdition.slug ===  lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
										onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
										>

                  </RaisedButton>

								})}
              </div>
              <div className="context-tabs tabs">
                  <RaisedButton
										className="context-tab tab"
										onClick={this.showLemmaPanel.bind(null, this.props.commentGroup)}
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
