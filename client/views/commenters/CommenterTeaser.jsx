import injectTapEventPlugin from 'react-tap-event-plugin';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CommunicationComment from 'material-ui/svg-icons/communication/comment';
import ActionInput from 'material-ui/svg-icons/action/input';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// commenter Teaser
CommenterTeaser = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  propTypes: {
    commenter: React.PropTypes.object.isRequired
  },


  render() {
    let commenter = this.props.commenter;
    let commenter_url = "/commenters/" + commenter.slug ;

     return (
       <div className="commenter-teaser">


        </div>
      );
    }

});

commenterTeaser.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
