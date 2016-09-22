CommentersList = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    limit: React.PropTypes.number,
		featureOnHomepage: React.PropTypes.bool,
  },

  getMeteorData() {
    let query = {};

    var limit = 100;

    if(this.props.limit){
      limit = this.props.limit;
    }
		if(this.props.featureOnHomepage){
			query.featureOnHomepage = this.props.featureOnHomepage;
		}

    return {
      commenters: Commenters.find(query, {sort: {name: 1}, limit: limit}).fetch(),
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
