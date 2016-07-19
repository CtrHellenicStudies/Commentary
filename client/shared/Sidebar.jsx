
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Sidebar = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

  render(){

		return(
			<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="primary" >

				<div class="sidenav-top">


		            <sec:ifLoggedIn>
		                <g:if test="${applicationContext.springSecurityService.currentUser.thumbnail}">
		                    <div class="user-image paper-shadow">
		                            <img src="${createLink(controller:'user', action:'showThumbnail',
		                                id:"${applicationContext.springSecurityService.currentUser.id}")}" />
		                    </div>
		                </g:if>

		                <span class="user-fullname">
		                    ${applicationContext.springSecurityService.currentUser.nicename}
		                </span>

		            </sec:ifLoggedIn>

				</div>
				<md-list>
		            <md-button href="/" target="_self" >
		                <i class="mdi mdi-home"></i>
		                Home
		            </md-button>
					<md-button href="/commentary/" target="_self" >
		                <i class="mdi mdi-alpha"></i>
		                Commentary
					</md-button>
		            <md-button href="/keyword/index" target="_self" >
		                <i class="mdi mdi-book-multiple"></i>
		                Keywords
		            </md-button>
		            <md-button href="/commentator/index" target="_self" >
		                <i class="mdi mdi-account-multiple-outline"></i>
		                Commenters
		            </md-button>
		            <md-button href="/about" target="_self" >
		                <i class="mdi mdi-book-open"></i>
		                About
		            </md-button>
		            <md-divider></md-divider>
		            <sec:ifLoggedIn>
		                <md-button href="/user/show/${applicationContext.springSecurityService.currentUser.id}#comments" target="_self" >
		                    <i class="mdi mdi-forum"></i>
		                    Your Comments
		                </md-button>
		                <md-button href="/user/show/${applicationContext.springSecurityService.currentUser.id}" target="_self" >
		                    <i class="mdi mdi-account"></i>
		                    Account
		                </md-button>
		                <md-button href="${createLink(controller:'logout')}" target="_self" >
		                    <i class="mdi mdi-logout"></i>
		                    Sign Out
		                </md-button>
		            </sec:ifLoggedIn>
		            <sec:ifNotLoggedIn>
		                <md-button href="#" target="_self" ng-click="show_login_modal($event, 'signin')">
		                    <i class="mdi mdi-login"></i>
		                    Sign in
		                </md-button>
		            </sec:ifNotLoggedIn>



				</md-list>
			</md-sidenav>

		);
	}

});
