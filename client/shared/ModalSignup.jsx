
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ModalSignup = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  render(){

    let styles = {
      flatButton : {
        width: "auto",
        minWidth: "none",
        height: "55px",
        padding: "10px 5px"
      },
      flatIconButton : {
        padding: "10px 20px",
        width: "auto",
        minWidth: "none",
        height: "55px",

      }

    };

    return (
      <div class="ahcip-modal-signup ahcip-modal ahcip-login-signup">
        <div class="close-modal paper-shadow" ng-click="hide_login_modal($event)">
          <i class="mdi mdi-close"></i>
        </div>
        <div class="modal-inner">
          <div class="login-links">
            <RaisedButton class="login-option login-option-google paper-card" href="/oauth/authenticate/google" target="_self">
              <i class="login-icon mdi mdi-google"></i>
              <span class="login-text">
                Join with Google
              </span>
            </RaisedButton>
            <RaisedButton class="login-option login-option-facebook paper-card" href="/oauth/authenticate/facebook"  target="_self">
              <i class="login-icon mdi mdi-facebook"></i>
              <span class="login-text">
                Join with Facebook
              </span>
            </RaisedButton>
            <RaisedButton class="login-option login-option-twitter paper-card" href="/oauth/authenticate/twitter"  target="_self">
              <i class="login-icon mdi mdi-twitter"></i>
              <span class="login-text">
                Join with Twitter
              </span>
            </RaisedButton>
            <hr/>
            <div class="login-other-option">
              <span class="login-other-option-label">
                Or, join with your email address.
              </span>
            </div>
              <form class="signup-form" method="POST" action="/j_spring_security_check" ng-submit="login($event)">
                <label for="email">Email</label>
                <input id="email" type="text" name="j_username" placeholder="odysseus@ithica.edu" ng-model="email"/>
                <label for="email">Password</label>
                <input id="pass" type="password" name="j_password" ng-model="password"/>
                 <a class="forgot-password" href="/forgot-password" target="_self">Forgot your password?</a>
                <input class="paper-card" type="submit" value="Login"/>
              </form>
          </div>
        </div>
      </div>

      );
  }
});
