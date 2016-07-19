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

    return (

      	<footer class="block-shadow">
      		<div class="container">
      			<div class="row footer-nav-row">
      				<div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
      					<div class="footer-nav-links" role="nav">
      						<md-button href="/commentary/?q=work.1" target="_self">Search</md-button>
      						<md-button href="/commentator/index" target="_self">Commentors</md-button>
      						<md-button href="/topic/index" target="_self">Topics</md-button>
      						<md-button href="/about" target="_self">About</md-button>
                              <sec:ifNotLoggedIn>
                                  <md-button aria-label="Login" href="#" ng-click="show_login_modal($event, 'signin')">Login</md-button>
                                  <md-button class="md-buttons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')">Join the Community</md-button>
                              </sec:ifNotLoggedIn>
      					</div>
      				</div>
      			</div>
      			<div class="row mb64 mb-xs-32">
      				<div class="col-md-5 text-right text-left-xs">
      					<h1 class="logo">A Homer Commentary in Progress</h1>
      				</div>

      				<div class="col-md-2 hidden-sm hidden-xs text-center">
      					<a href="http://chs.harvard.edu" target="_blank">
      						<asset:image class="site-logo" src="logo-tower.png"/>
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
      			</div><!--end of row-->
      			<div class="row">
      				<div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
      					<p class="fade-1-4 copyright">&copy; <g:formatDate format="yyyy" date="${new Date()}" /> The Center for Hellenic Studies.  See our <a href="/terms" target="_self">terms and privacy policy</a>.</p>
      				</div>
      			</div><!--end of row-->
      		</div><!--end of container-->
      	</footer>

		);
	}
});
