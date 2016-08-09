import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import InfiniteScroll from '../../../imports/InfiniteScroll';


Commentary = React.createClass({

  propTypes: {
		isOnHomeView: React.PropTypes.bool,
		filters: React.PropTypes.array,
		addSearchTerm: React.PropTypes.func,
		loadMoreComments: React.PropTypes.func,
		skip: React.PropTypes.number,
  },

  getInitialState(){
    return {
      contextPanelOpen : false,
      referenceLemma : [],
      referenceLemmaSelectedEdition : {lines: []},
			commentLemmaGroups: []

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
				commentGroups = [];

		// Parse the filters to the query
		this.props.filters.forEach(function(filter){
			switch(filter.key){
				case "textsearch":
					query.$text = { $search : filter.values[0]};
					break;

				case "keywords":
					var values = [];
					filter.values.forEach(function(value){
						values.push(value.wordpressId);
					})
					query['keywords.wordpressId'] = { $in: values };
					break;

				case "commenters":
					var values = [];
					filter.values.forEach(function(value){
						values.push(value.wordpressId);
					})
					query['commenters.wordpressId'] = { $in: values };
					break;

				case "works":
					var values = [];
					filter.values.forEach(function(value){
						values.push(value.slug);
					})
					query['work.slug'] = { $in: values };
					break;

				case "subworks":
					var values = [];
					filter.values.forEach(function(value){
						values.push(value.n);
					})
					query['subwork.n'] = { $in: values };
					break;

				case "lineFrom":
					// Values will always be an array with a length of one
					query.lineFrom = query.lineFrom || {};
					query.lineFrom.$gte = filter.values[0];
					break;

				case "lineTo":
					// Values will always be an array with a length of one
					query.lineFrom = query.lineFrom || {};
					query.lineFrom.$lte = filter.values[0];
					break;

			}
		});

		console.log("Commentary query:", query);
		var handle = Meteor.subscribe('comments', query, this.props.skip, 10);
    if(handle.ready()) {
	    comments = Comments.find({}, {sort:{"work.order":1, "subwork.n":1, lineFrom:1, nLines:-1}}).fetch();
			//console.log("Commentary comments:", comments);
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

				commentGroups.push({
					ref : ref,
					selectedLemmaEdition : {lines:[]},
					lemmaText: [],
					work : comment.work,
					subwork : comment.subwork,
					lineFrom : comment.lineFrom,
					lineTo : comment.lineTo,
					nLines : comment.nLines,
					comments : [comment]
				});

			}

		});

		// Unique commenters for each comment group
		commentGroups.forEach(function(commentGroup, i){
			var isInCommenters = false;
			var commenters = [];
			var lemmaQuery = {};

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

			var lemmaQuery = {
						'work.slug' : commentGroup.work.slug,
						'subwork.n' : commentGroup.subwork.n,
						'text.n' : {
							$gte: commentGroup.lineFrom,
						}
					};

			if(typeof commentGroup.lineTo !== "undefined"){
				lemmaQuery['text.n'].$lte = commentGroup.lineTo;

			}else {
				lemmaQuery['text.n'].$lte = commentGroup.lineFrom;

			}

			var handle2 = Meteor.subscribe('textNodes', lemmaQuery);
			if (handle2.ready()) {
				console.log("lemmaQuery", lemmaQuery);
				var textNodes = TextNodes.find(lemmaQuery).fetch();
				var editions = [];

				var textIsInEdition = false;
				textNodes.forEach(function(textNode){

					textNode.text.forEach(function(text){
						textIsInEdition = false;

						editions.forEach(function(edition){

							if(text.edition.slug === edition.slug){
								edition.lines.push({
									html: text.html,
									n: text.n
								});
								textIsInEdition = true;

							}

						})

						if(!textIsInEdition){
							editions.push({
								title : text.edition.title,
								slug : text.edition.slug,
								lines : [
									{
										html: text.html,
										n: text.n
									}
								],
							})

						}

					});

				});

				commentGroup.lemmaText = editions;
			}


		});

    return {
      commentGroups: commentGroups
    };

  },

  componentDidMount(){
    this.textServerEdition = new Meteor.Collection('textServerEdition');

  },

	loadMoreComments(){

		if(!this.props.isOnHomeView && this.commentGroups.length){
			this.props.loadMoreComments();
		}

	},

  toggleLemmaEdition(){
    this.setState({
      selectedLemmaEdition : {}
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

	showLemmaPanel(commentGroup){

	},
	hideLemmaPanel(){

	},

	showDiscussionThread(commentGroup){

	},
	hideDiscussionThread(){

	},


  render() {

		var self = this;
		var more_commentary_left = true;
		var isOnHomeView;
    var commentGroups;
		var filtersChanged = false;

		if('isOnHomeView' in this.props){
			isOnHomeView = this.props.isOnHomeView;

		}else {
			isOnHomeView = false;

		}

		//console.log("Commentary comments:", this.data.commentGroups);
		//console.log("Commentary.props.skip", this.props.skip);

		if(
				this.commentGroups.length === 0
			|| this.props.skip === 0
		){
			$("html, body").animate({ scrollTop: 0 }, "fast");
			this.commentGroups = [];
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


		//console.log("Commentary.commentGroups", this.commentGroups);

    return (
      <div className="commentary-primary content ">
				<InfiniteScroll
					endPadding={100}
					loadMore={this.loadMoreComments}
					>

					<div className="commentary-comments commentary-comment-groups">
		      	{this.commentGroups.map(function(commentGroup, i){
		          return(
		              <div
										className="comment-group "
										data-ref={commentGroup.ref}
										key={i}
										>
		                  <div className="comments" >

		                      <CommentLemma
														commentGroup={commentGroup}
														showLemmaPanel={self.showLemmaPanel}
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

				{(!isOnHomeView && this.commentGroups.length > 0 && more_commentary_left) ?
	        <div className="ahcip-spinner commentary-loading" >
	            <div className="double-bounce1"></div>
	            <div className="double-bounce2"></div>

	        </div>
				: "" }

				{(this.data.loaded && this.commentGroups.length === 0 ) ?
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
          selectedLemmaEdition={this.state.referenceLemmaSelectedEdition}
          lemmaText={this.state.referenceLemma}
          toggleLemmaEdition={this.toggleLemmaEdition}

          />
        {/*<!-- .commentary-primary -->*/}
      </div>
     );
   }

});
