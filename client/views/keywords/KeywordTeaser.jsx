import Card from 'material-ui/Card';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

KeywordTeaser = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  propTypes: {
    keyword: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
			open: false
		};
	},

	toggleOpen(){
		this.setState({
				open : !this.state.open
		});

	},


  render() {
    let keyword = this.props.keyword;
    let keywordUrl = "/keywords/" + keyword.slug ;
		let keywordClass = "keyword-teaser clearfix wow fadeInUp ";
		if(this.state.open){
			keywordClass += "keyword-open";
		}


     return (
       <div
				 className={keywordClass}
				 data-wow-duration="0.2s"
				 onClick={this.toggleOpen}>
	        <h4 className="keyword-title" >
	            {keyword.title}
	        </h4>
					<i className="mdi mdi-plus"></i>
					<i className="mdi mdi-minus"></i>
	        <span className="keyword-comment-count">({keyword.count} Comments)</span>
					<hr />
	        <span className="keyword-description">{keyword.description || "Quid faciat laetas segetes quo sidere terram vertere Mycenas ulmisque adiungere vites conveniat quae curum boum qui cultus habendo sit pecori apibus quanta experientia parcis, hinc canere incipiam"}</span>
					<a
						className="keyword-read-more"
						href={keywordUrl}>
						Read more
					</a>
      </div>

      );
	}

});
