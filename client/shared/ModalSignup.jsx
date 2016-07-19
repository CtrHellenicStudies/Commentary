
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ModalSignup = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes = {
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
            <md-button class="login-option login-option-google paper-card" href="/oauth/authenticate/google" target="_self">
              <i class="login-icon mdi mdi-google"></i>
              <span class="login-text">
                Join with Google
              </span>
            </md-button>
            <md-button class="login-option login-option-facebook paper-card" href="/oauth/authenticate/facebook"  target="_self">
              <i class="login-icon mdi mdi-facebook"></i>
              <span class="login-text">
                Join with Facebook
              </span>
            </md-button>
            <md-button class="login-option login-option-twitter paper-card" href="/oauth/authenticate/twitter"  target="_self">
              <i class="login-icon mdi mdi-twitter"></i>
              <span class="login-text">
                Join with Twitter
              </span>
            </md-button>
            <hr>
            <div class="login-other-option">
              <span class="login-other-option-label">
                Or, join with your email address.
              </span>
                <g:form class="login-other-option-form" controller="user" action="register" method="POST">
                    <fieldset>
                        <g:hasErrors bean="${user}">
                            <div class="errors">
                                <g:renderErrors bean="${user}"/>
                            </div>
                        </g:hasErrors>
                        <g:textField name="username" value="${user?.username}" placeholder="Username"
                                     class="${hasErrors(bean:user,field:'username','errors')}"/>
                        <g:textField name="email" value="${user?.email}" placeholder="Email"
                                     class="${hasErrors(bean:user,field:'email','errors')}"/>
                        <g:passwordField name="password" placeholder="Password"
                                         class="${hasErrors(bean:user,field:'password','errors')}" />
                        <g:passwordField name="confirm" placeholder="Repeat password"
                                         class="${hasErrors(bean:user,field:'password','errors')}" />
                        <g:submitButton class="button paper-card" name="submitButton" value="Create Account" />
                    </fieldset>
                </g:form>
            </div>
          </div>
        </div>
      </div>

      );
  }
});
