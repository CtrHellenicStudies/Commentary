import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


Commentary = React.createClass({

  propTypes: {
		isOnHomeView: React.PropTypes.bool
  },

  getInitialState(){
    return {
      selectedEdition : "",
      contextPanelOpen : false,
      referenceLemma : [],
      referenceLemmaSelectedEdition : {lines: []}
    }

  },


  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    var query = {},
        lemma_query = {},
        lemma_text = [],
        selected_edition = { lines: []};

    var comments = Comments.find(query).fetch();

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

    return {
      commentGroups: [],
      lemmaText: lemma_text,
      selectedEdition: selected_edition
    };
  },

  componentDidMount(){
    this.textServerEdition = new Meteor.Collection('textServerEdition');

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

    var comment_groups = this.data.commentGroups;

    return (
      <div className="commentary-primary content ">
      {comment_groups.map(function(comment_group){

          return(
              <div className="comment-group " data-ref="{comment_group.ref}">
                  <div className="comments" >

                      <CommentLemma />

                      {comment_group.comments.map(function(comment){
                        <div className="comment-outer has-discussion " >

                            <Comment/>

                            <CommentDiscussion />


                        </div>
                      })}

                  </div> {/*<!-- .comments -->*/}

                  <hr className="comment-group-end"/>

              </div>
          )
        })}

        <div className="ahcip-spinner commentary-loading" >
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>

        </div>

        <div className="no-commentary-wrap">
          <p className="no-commentary no-results" >
            No commentary available for the current search.
          </p>

        </div>

        <div className="lemma-reference-modal">
            <article className="comment  lemma-comment paper-shadow " >
              {this.state.referenceLemmaSelectedEdition.lines.map(function(line){

                return <p
                  className="lemma-text"
                  dangerouslySetInnerHTML={{__html: line.html}}
                  ></p>

              })}

                <div className="edition-tabs tabs">
                  {this.state.referenceLemma.map(function(lemma_text_edition){

                    return <FlatButton
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
