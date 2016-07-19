// List of discussionComments
DiscussionCommentsList = React.createClass({

  // This mixin makes the getMeteorData method discussionComment
  mixins: [ReactMeteorData],

  propTypes: {
  },

  // Loads items from the discussionComments collection and puts them on this.data.discussionComments
  getMeteorData() {
    let query = {};

    return {
      discussionComments: DiscussionComments.find(query, {sort: {author: 1, title: 1}}).fetch()
    };
  },

  renderDiscussionComments() {

    return this.data.discussionComments.map((discussionComment) => {
      return <DiscussionCommentTeaser
              key={discussionComment._id}
              discussionComment={discussionComment} />;

    });

  },

  render() {

     return (
       <div className="discussionComments-list">

         {this.data.discussionComments.map((discussionComment) => {
            return <discussionCommentTeaser
              key={discussionComment._id}
              discussionComment={discussionComment} />;
          })}

       </div>


      );
    }


});
