import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// commenter Teaser
CommenterTeaser = React.createClass({

  propTypes: {
    commenter: React.PropTypes.object.isRequired
  },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  render() {
    let commenter = this.props.commenter;
    let commenter_url = "/commenters/" + commenter.slug ;

     return (
       <div className="author-teaser hvr-grow wow fadeIn" >
              <a href="/commenter/show/{commenter.id}" >
                  <div className="author-image paper-shadow">
                    <img src="/images/default_user.jpg" alt="{commenter.name}"/>
                  </div>
              </a>
              <div className="author-teaser-text">
                  <a href="/commenters/show/{commenter.id}" >
                      <h3>{commenter.name}</h3>
                  </a>
                  <hr/>
                  <p className="author-description">
                      {commenter.tagline}
                  </p>

              </div>
          </div>


      );
    }

});
