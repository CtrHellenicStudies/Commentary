
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ModalLogin = React.createClass({

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
      <div className="ahcip-modal-login ahcip-modal ahcip-login-signup" >
        <div className="close-modal paper-shadow" >
          <i className="mdi mdi-close"></i>
        </div>
        <div className="modal-inner">
          <div className="login-links">
            <RaisedButton href="/oauth/authenticate/google" className="login-option login-option-google paper-card" target="_self">
              <i className="login-icon mdi mdi-google"></i>
              <span className="login-text">
                Login with Google
              </span>
            </RaisedButton>
            <RaisedButton href="/oauth/authenticate/facebook" className="login-option login-option-facebook paper-card" target="_self">
              <i className="login-icon mdi mdi-facebook"></i>
              <span className="login-text">
                Login with Facebook
              </span>
            </RaisedButton>
            <RaisedButton href="/oauth/authenticate/twitter" className="login-option login-option-twitter paper-card" target="_self">
              <i className="login-icon mdi mdi-twitter"></i>
              <span className="login-text">
                Login with Twitter
              </span>
            </RaisedButton>
              <hr/>
            <div className="login-other-option">
              <span className="login-other-option-label">
                Or login with your email address.
              </span>
              <form className="signup-form" method="POST" action="/j_spring_security_check" >
                <label for="email">Email</label>
                <input id="email" type="text" name="j_username" placeholder="odysseus@ithica.edu" />
                <label for="email">Password</label>
                <input id="pass" type="password" name="j_password" />
                 <a className="forgot-password" href="/forgot-password" target="_self">Forgot your password?</a>
                <input className="paper-card" type="submit" value="Login"/>
              </form>
            </div>
          </div>
        </div>
      </div>
      );
  }
});
