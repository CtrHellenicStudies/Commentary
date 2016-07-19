
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Header = React.createClass({

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
      	<header ng-class="{'search-enabled': search_enabled == true}" headroom>
      		<md-toolbar class="md-menu-toolbar" ng-hide="search_enabled">
      			<div class="toolbar-tools">

      				<md-button aria-label="Toggle side menu" ng-click="togglePrimary()" class="side-menu-toggle">
      					<i class="mdi mdi-menu"></i>
      				</md-button>

      				<md-button aria-label="Home" href="/" target="_self" class="site-title" ng-show="!active_comment">
      					<h3 class="logo">A Homer Commentary in Progress</h3>
      				</md-button>

      				<div class="active-comment-meta" ng-show="active_comment">
      					<h3>{{active_comment.title}}:</h3>
      					<p class="lemma-text">{{active_comment.lemma}}</p>

      				</div>


      				<div class="search-toggle">
      					<md-button aria-label="Search" class="search-button" ng-click="toggle_search_mode()">
      						<i class="mdi mdi-magnify"></i>
      					</md-button>
      				</div>

      				<div class="header-section-wrap nav-wrap" ng-show="!active_comment">
      					<md-button aria-label="Commentary" href="/commentary/" target="_self" >Commentary</md-button>
      					<md-button aria-label="About" href="/about" target="_self">About </md-button>
                          <sec:ifNotLoggedIn>
                              <md-button aria-label="Login" href="#" ng-click="show_login_modal($event, 'signin')" ng-hide="username.length">Login</md-button>
                              <md-button class="md-buttons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')" ng-hide="username.length">Join the Community</md-button>
                              <md-button class="md-buttons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')" ng-hide="!username.length">{{username}}</md-button>
                          </sec:ifNotLoggedIn>
                          <sec:ifLoggedIn>
                              <md-button href="/user/show/${applicationContext.springSecurityService.currentUser.id}" target="_self" >
                                  ${applicationContext.springSecurityService.currentUser.nicename}
                              </md-button>
                          </sec:ifLoggedIn>
      				</div>

      				<div class="dropdown-search-tools">
      					<div class="grid inner"></div>
      				</div>

      			</div>

      		</md-toolbar>

      		<md-toolbar class="md-menu-toolbar" ng-show="search_enabled">
      			<div class="toolbar-tools">

      				<md-button aria-label="Toggle side menu" ng-click="togglePrimary()" class="side-menu-toggle">
      					<i class="mdi mdi-menu"></i>
      				</md-button>

      				<div class="search-tools">

      					<div class="search-tool text-search">
      						<input type="text" ng-model="form.textsearch" placeholder="Search" ng-model-options="{debounce:500}"/>
      					</div>

      					<div class="dropdown">
      						<md-button class="search-tool search-type-keyword dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Keyword
      							<i class="mdi mdi-chevron-down"></i>
      						</md-button>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                                      <g:each var="keyword" in="${keywords}">
                                          <li><md-button ng-click="toggle_search_term( $event )" data-key="keyword" data-id=${keyword.id}>
                                              <i class="mdi mdi-plus-circle-outline"></i>
                                              <span>
                                                  ${keyword.title}
                                              </span>
                                          </md-button></li>
                                      </g:each>
      							</div>
      						</ul>

      					</div>

      					<div class="dropdown">
      						<md-button class="search-tool search-type-commenter dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Commenter
      							<i class="mdi mdi-chevron-down"></i>
      						</md-button>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                                      <g:each var="commentor" in="${commentators}">
                                          <li><md-button ng-click="toggle_search_term( $event )" data-key="commenter" data-id=${commentor.id}>
                                              <i class="mdi mdi-plus-circle-outline"></i>
                                              <span>
                                                  ${commentor.name}
                                              </span>
                                          </md-button></li>
                                      </g:each>
      							</div>
      						</ul>

      					</div>

      					<div class="dropdown">
      						<md-button class="search-tool search-type-work dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Work
      							<i class="mdi mdi-chevron-down"></i>
      						</md-button>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                                      <g:each var="work" in="${works}">
                                          <li><md-button ng-click="toggle_search_term( $event )" data-key="work" data-id=${work.id}>
                                              <i class="mdi mdi-plus-circle-outline"></i>
                                              <span>${work.title}</span>
                                          </md-button></li>
                                      </g:each>
      							</div>

      						</ul>

      					</div>

      					<div class="dropdown">
      						<md-button class="search-tool search-type-book dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Book
      							<i class="mdi mdi-chevron-down"></i>
      						</md-button>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                                      <g:each var="subwork" in="${subworks}">
                                          <li><md-button ng-click="toggle_search_term( $event )" data-key="book" data-id=${subwork.id}>
                                              <i class="mdi mdi-plus-circle-outline"></i>
                                              <span>${subwork.work.title} ${subwork.title}</span>
                                          </md-button></li>
                                      </g:each>
      							</div>


      						</ul>

      					</div>
      					<div class="search-tool text-search line-search">
      						<label>Line</label>
      						<input type="text" ng-model="form.linefrom" placeholder="From"
      							   ng-model-options="{debounce:500}"/>
      						<input type="text" ng-model="form.lineto" placeholder="To"
      							   ng-model-options="{debounce:500}"/>
      					</div>
      				</div>
      				<div class="search-toggle">
      					<md-button aria-label="Search" class="search-button" ng-click="toggle_search_mode()">
      						<i class="mdi mdi-magnify"></i>
      					</md-button>
      				</div>
      			</div>
      		</md-toolbar>
      	</header>

    )
  }
});
