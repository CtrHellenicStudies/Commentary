Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
      showMore: false
    }

  },

  toggleShowMore(e) {
    this.setState({
        showMore: ! this.state.showMore
    })

  },

  render() {

    var  commentClassName = "meta-item panel-item commentary-comment " + (this.state.showMore ? "expanded" : "");

    return (
       <div className={commentClassName} data-num={this.props.comment.index}>

       </div>

     );
   }

});
