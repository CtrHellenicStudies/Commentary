CommentersList = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
  },

  getMeteorData() {
    let query = {};

    return {
      commenters: Commenters.find(query, {sort: {lastName: 1, firstName: 1}}).fetch(),
    };
  },

  renderCommenters() {

    return this.data.commenters.map((commenter) => {
      return <CommenterTeaser
              key={commenter._id}
              commenter={commenter} />;

    });

  },

  render() {

     return (
       <div className="commenters-list">

         {this.renderCommenters()}

       </div>


      );
    }


});
