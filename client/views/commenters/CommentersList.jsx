CommentersList = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    limit: React.PropTypes.number
  },

  getMeteorData() {
    let query = {};

    var limit = 100;

    if(typeof this.props.limit !== "undefined"){
      limit = this.props.limit;
    }

    return {
      commenters: Commenters.find(query, {sort: {lastName: 1, firstName: 1}, limit: limit}).fetch(),
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
