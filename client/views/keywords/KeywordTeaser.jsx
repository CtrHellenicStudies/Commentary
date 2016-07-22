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


  render() {
    let keyword = this.props.keyword;
    let keyword_url = "/keywords/" + keyword.slug ;

     return (
       <div  className="keyword-teaser wow fadeInUp" data-wow-duration="0.2s">
        <a className="keyword-title" href="/keyword/show/{keyword.id}" >
            {keyword.title}
        </a>
        <span className="keyword-comment-count">437 Comments</span>
        <span className="keyword-description">{keyword.description}</span>

      </div>

      );
    }

});
