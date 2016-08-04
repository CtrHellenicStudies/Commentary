import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import InfiniteScroll from '../../../imports/InfiniteScroll';


Commentary = React.createClass({

  propTypes: {
		isOnHomeView: React.PropTypes.bool,
		addSearchTerm: React.PropTypes.func
  },

  getInitialState(){
    return {
      selectedEdition : "",
      contextPanelOpen : false,
      referenceLemma : [],
      referenceLemmaSelectedEdition : {lines: []},
			skip: 0
    }

  },

	commentGroups: [],

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    var query = {},
				comments = [],
        lemma_query = {},
        lemma_text = [],
        selected_edition = { lines: []},
				commentGroups = [];

		var handle = Meteor.subscribe('comments', this.state.skip, 10);
    if(handle.ready()) {
	    comments = Comments.find(query).fetch();
			console.log(comments);
    }

    //On the client
    Meteor.call('textServer', lemma_query,
      function(error,response){
          lemma_text = response;
      });

    if(lemma_text.length > 0){
      selected_edition = lemma_text[0];
    }

    if(lemma_text.length > 0){
      selected_edition = lemma_text[0];
    }

		// Make comment groups from comments
		var isInCommentGroup = false;
		comments.forEach(function(comment){
			isInCommentGroup = false;
			commentGroups.forEach(function(commentGroup){
				if (
						comment.work.title === commentGroup.work.title
					&& comment.subwork.n === commentGroup.subwork.n
					&& comment.lineFrom === commentGroup.lineFrom
					&& comment.lineTo === commentGroup.lineTo
					) {
						isInCommentGroup = true;
						commentGroup.comments.push(comment)

					}
			});

			if(!isInCommentGroup){
				var ref;

				if(comment.work.title == "Homeric Hymns"){
					ref = "Hymns " + comment.subwork.n + "." + comment.lineFrom

				}else {
					ref = comment.work.title + " " + comment.subwork.n + "." + comment.lineFrom

				}

				var nLines = 1;

				if( comment.lineTo ){
					ref = ref + "-" + comment.lineTo
					n_lines = comment.lineTo - comment.lineFrom + 1
				}


				commentGroups.push({
					ref : ref,
					editions : [],
					selectedEdition : {lines:[]},
					work : comment.work,
					subwork : comment.subwork,
					lineFrom : comment.lineFrom,
					lineTo : comment.lineTo,
					nLines : nLines,
					comments : [comment]
				});

			}

		});

		// Unique commenters for each comment group
		commentGroups.forEach(function(commentGroup){
			var isInCommenters = false;
			var commenters = [];
			commentGroup.comments.forEach(function(comment){
				isInCommenters = false;
				comment.commenters.forEach(function(commenter){

					if(commenters.some(function(c){
						return c.slug === commenter.slug
					})){
						isInCommenters = true;

					}else {
						commenters.push(commenter);

					}

				});

			});

			commentGroup.commenters = commenters;

		});


    return {
			loaded: true,
      commentGroups: commentGroups,
      lemmaText: lemma_text,
      selectedEdition: selected_edition
    };
  },

  componentDidMount(){
    this.textServerEdition = new Meteor.Collection('textServerEdition');

  },

	loadMoreComments(){

		if(!this.props.isOnHomeView && this.commentGroups.length){

	    this.setState({
	      skip : this.state.skip + 10
	    });

			console.log("Load more comments:", this.state.skip);

		}

	},

  toggleLemmaEdition(){
    this.setState({
      selectedEdition : {}
    });

  },

  closeContextPanel(){
    this.setState({
      contextPanelOpen : false
    });

  },

  searchReferenceLemma(){
    this.setState({
      referenceLemma: [],
      referenceLemmaSelectedEdition: {lines: []}
    });

  },


  render() {

		var self = this;
		var more_commentary_left = true;
		var isOnHomeView;
    var commentGroups;

		if('isOnHomeView' in this.props){
			isOnHomeView = this.props.isOnHomeView;

		}else {
			isOnHomeView = false;

		}

		if(this.commentGroups.length === 0){
			this.commentGroups = this.data.commentGroups;

		}else {

			this.data.commentGroups.forEach(function(dataCommentGroup){
				var isInCommentGroups = false;
				self.commentGroups.forEach(function(commentGroup){
					if(dataCommentGroup.ref === commentGroup.ref){
						isInCommentGroups = true;


						dataCommentGroup.comments.forEach(function(dataComment){
							var isInCommentGroup = false;

							commentGroup.comments.forEach(function(comment){
								if(dataComment._id === comment._id){
									isInCommentGroup = true;
								}

							});

							if(!isInCommentGroup){
								commentGroup.comments.push(dataComment);
							}

						});


					}
				});

				if(!isInCommentGroups){
					self.commentGroups.push(dataCommentGroup);
				}

			});
		}


		commentGroups = this.commentGroups;

    return (
      <div className="commentary-primary content ">
				<InfiniteScroll
					endPadding={100}
					loadMore={this.loadMoreComments}
					>

					<div className="commentary-comments commentary-comment-groups">
		      	{commentGroups.map(function(commentGroup, i){
		          return(
		              <div
										className="comment-group "
										data-ref={commentGroup.ref}
										key={i}
										>
		                  <div className="comments" >

		                      <CommentLemma
														commentGroup={commentGroup}
														/>

													{commentGroup.comments.map(function(comment, i){
		                        return <div
															key={i}
															className="comment-outer has-discussion "
															>

		                            <Comment
																	commentGroup={commentGroup}
																	comment={comment}
																	/>

		                            <CommentDiscussion
																	comment={comment}
																	/>


		                        </div>
		                      })}

		                  </div> {/*<!-- .comments -->*/}

		                  <hr className="comment-group-end"/>

		              </div>
		          )
		        })}
					</div>

				</InfiniteScroll>

				{(!isOnHomeView && this.data.loaded && commentGroups.length > 0 && more_commentary_left) ?
	        <div className="ahcip-spinner commentary-loading" >
	            <div className="double-bounce1"></div>
	            <div className="double-bounce2"></div>

	        </div>
				: "" }

				{(this.data.loaded && commentGroups.length === 0 ) ?
	        <div className="no-commentary-wrap">
	          <p className="no-commentary no-results" >
	            No commentary available for the current search.
	          </p>

	        </div>
				: "" }

        <div className="lemma-reference-modal">
            <article className="comment  lemma-comment paper-shadow " >
              {this.state.referenceLemmaSelectedEdition.lines.map(function(line, i){

                return <p
									key={i}
                  className="lemma-text"
                  dangerouslySetInnerHTML={{__html: line.html}}
                  ></p>

              })}

                <div className="edition-tabs tabs">
                  {this.state.referenceLemma.map(function(lemma_text_edition, i){

                    return <FlatButton
															key={i}
                              label={edition.title}
                              data-edition={edition.title}
                              className="edition-tab tab"
                              onClick={this.toggleLemmaEdition}
                              >
                          </FlatButton>

                  })}

                </div>

                <i className="mdi mdi-close paper-shadow" onClick={this.hideLemmaReference}>
                </i>
            </article>

        </div>{/*<!-- .lemma-reference-modal -->*/}

        <ContextPanel
          open={this.state.contextPanelOpen}
          closeContextPanel={this.closeContextPanel}
          selectedEdition={this.data.selectedEdition}
          lemmaText={this.data.lemmaText}
          toggleLemmaEdition={this.toggleLemmaEdition}

          />
        {/*<!-- .commentary-primary -->*/}
      </div>
     );
   }

});
