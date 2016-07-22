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
       <div className="commenter-teaser">
         <div class="author-teaser hvr-grow wow fadeIn" >
                <a href="/commentator/show/${commentator.id}" >
                    <div class="author-image paper-shadow">
                      <img src="/images/default_user.jpg" alt="{commentator.name}"/>
                    </div>
                </a>
                <div class="author-teaser-text">
                    <a href="/commentator/show/{commentator.id}" >
                        <h3>${commentator.name}</h3>
                    </a>
                    <hr>
                    <p class="author-description">
                        {commentator.tagline}
                    </p>

                </div>
            </div>


        </div>
      );
    }

});
