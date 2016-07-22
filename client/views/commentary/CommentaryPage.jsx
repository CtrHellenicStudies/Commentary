import RaisedButton from 'material-ui/RaisedButton';

CommentaryPage = React.createClass({

  propTypes: {
    work: React.PropTypes.object.isRequired,
    textNodes: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      annotationCheckList: [],
    }
  },

  renderText() {
    return this.props.textNodes.map((text, index) => {
      let showNumber = false;
      let numbering = "";


      return <ReadingText
                key={text._id}
                index={index}
                showNumber={showNumber}
                text={text}
                numbering={numbering}
                annotationCheckList = {this.state.annotationCheckList}
                addAnnotationCheckList = {this.addAnnotationCheckList} />;
    });
  },


  render() {
    let work = this.props.work;

    return (
        <div className="reading-environment commentary-page">
          <Commentary />


        </div>

    );

  }

});
