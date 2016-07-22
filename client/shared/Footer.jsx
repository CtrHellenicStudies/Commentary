
import RaisedButton from 'material-ui/RaisedButton';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


Footer = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
      muiTheme: React.PropTypes.object.isRequired,
  },


  render(){

		let date = new Date();
		let year = date.getFullYear();

    let styles = {
      circleButton : {
        width: "auto",
        height: "auto",
      },
      circleButtonIcon : {
        color: "#ffffff",

      }
    }

    var user_is_loggedin = false;

    return (

      	<footer class="block-shadow">
      		<div class="container">
      			<div class="row footer-nav-row">
      				<div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
      					<div class="footer-nav-links" role="nav">
      						<RaisedButton href="/commentary/?q=work.1" >Search</RaisedButton>
      						<RaisedButton href="/commentator/index" >Commentors</RaisedButton>
      						<RaisedButton href="/topic/index" >Topics</RaisedButton>
      						<RaisedButton href="/about" >About</RaisedButton>
                  { user_is_loggedin ? "" :
                    <div>
                      <RaisedButton aria-label="Login" href="#" ng-click="show_login_modal($event, 'signin')">Login</RaisedButton>
                      <RaisedButton class="RaisedButtons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')">Join the Community</RaisedButton>
                    </div>
                  }
      					</div>
      				</div>
      			</div>
      			<div class="row mb64 mb-xs-32">
      				<div class="col-md-5 text-right text-left-xs">
      					<h1 class="logo">A Homer Commentary in Progress</h1>
      				</div>

      				<div class="col-md-2 hidden-sm hidden-xs text-center">
      					<a href="http://chs.harvard.edu" target="_blank">
      						<img class="site-logo" src="/images/logo-tower.png"/>
      					</a>
      				</div>

      				<div class="col-md-5 col-sm-6">
      					<p class="lead">
      						For more information about the Commentary or general media inquiries, please contact <a href="mailto:contact@ahcip.chs.harvard.edu">contact@ahcip.chs.harvard.edu</a>.
      					</p>

      					<p class="lead">
      					 This website is provided by <a href="http://chs.harvard.edu" target="_blank">The Center for Hellenic Studies</a>.
      					</p>

      				</div>
      			</div>{/*<!--end of row-->*/}
      			<div class="row">
      				<div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
      					<p class="fade-1-4 copyright">&copy; 2016 The Center for Hellenic Studies.  See our <a href="/terms" >terms and privacy policy</a>.</p>
      				</div>
      			</div>{/*<!--end of row-->*/}
      		</div>{/*<!--end of container-->*/}
      	</footer>

		);
	}
});
