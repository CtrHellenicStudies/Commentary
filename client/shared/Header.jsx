
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Header = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      leftMenuOpen : false
    };
  },

  toggleLeftMenu(){
    this.setState({
      leftMenuOpen : !this.state.leftMenuOpen
    });
  },

  closeLeftMenu(){
    this.setState({
      leftMenuOpen : false
    });
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

    var user_is_loggedin = false;

    var active_comment = false;
    var username = false;

    var keyword = {id:1};
    var commenter = {id:1};
    var work = {id:1};
    var subwork = {work:{title:"Iliad"},id:1, title:"1"};

    return (
      <div>
        <LeftMenu
          open={this.state.leftMenuOpen}
          closeLeftMenu={this.closeLeftMenu}
          />
      	<header ng-class="{'search-enabled': search_enabled == true}" headroom>
      		<md-toolbar class="md-menu-toolbar" ng-hide="search_enabled">
      			<div class="toolbar-tools">

      				<RaisedButton aria-label="Toggle side menu" ng-click="togglePrimary()" class="side-menu-toggle">
      					<i class="mdi mdi-menu"></i>
      				</RaisedButton>

      				<RaisedButton aria-label="Home" href="/"  class="site-title" ng-show="!active_comment">
      					<h3 class="logo">A Homer Commentary in Progress</h3>
      				</RaisedButton>

              {active_comment ?
        				<div class="active-comment-meta" ng-show="active_comment">
        					<h3>{active_comment.title}:</h3>
        					<p class="lemma-text">{active_comment.lemma}</p>

        				</div>
              : ""}


      				<div class="search-toggle">
      					<RaisedButton aria-label="Search" class="search-button" ng-click="toggle_search_mode()">
      						<i class="mdi mdi-magnify"></i>
      					</RaisedButton>
      				</div>

      				<div class="header-section-wrap nav-wrap" ng-show="!active_comment">
      					<RaisedButton aria-label="Commentary" href="/commentary/"  >Commentary</RaisedButton>
      					<RaisedButton aria-label="About" href="/about" >About </RaisedButton>
                {user_is_loggedin ?
                    <div>
                      <RaisedButton href="/user/show/{applicationContext.springSecurityService.currentUser.id}"  >
                          {applicationContext.springSecurityService.currentUser.nicename}
                      </RaisedButton>
                    </div>
                  :
                    <div>
                      <RaisedButton aria-label="Login" href="#" ng-click="show_login_modal($event, 'signin')" ng-hide="username.length">Login</RaisedButton>
                      <RaisedButton class="RaisedButtons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')" ng-hide="username.length">Join the Community</RaisedButton>
                      <RaisedButton class="RaisedButtons-signup" aria-label="Join" href="#" ng-click="show_login_modal($event, 'signup')" ng-hide="!username.length">{username}</RaisedButton>
                    </div>
                }
      				</div>

      				<div class="dropdown-search-tools">
      					<div class="grid inner"></div>
      				</div>

      			</div>

      		</md-toolbar>

      		<md-toolbar class="md-menu-toolbar" ng-show="search_enabled">
      			<div class="toolbar-tools">

      				<RaisedButton aria-label="Toggle side menu" ng-click="togglePrimary()" class="side-menu-toggle">
      					<i class="mdi mdi-menu"></i>
      				</RaisedButton>

      				<div class="search-tools">

      					<div class="search-tool text-search">
      						<input type="text" ng-model="form.textsearch" placeholder="Search" ng-model-options="{debounce:500}"/>
      					</div>

      					<div class="dropdown">
      						<RaisedButton class="search-tool search-type-keyword dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Keyword
      							<i class="mdi mdi-chevron-down"></i>
      						</RaisedButton>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                      <li>
                        <RaisedButton ng-click="toggle_search_term( $event )" data-key="keyword" data-id={keyword.id}>
                            <i class="mdi mdi-plus-circle-outline"></i>
                            <span>
                                {keyword.title}
                            </span>
                        </RaisedButton>

                      </li>
      							</div>
      						</ul>

      					</div>

      					<div class="dropdown">
      						<RaisedButton class="search-tool search-type-commenter dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Commenter
      							<i class="mdi mdi-chevron-down"></i>
      						</RaisedButton>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                      <li>
                        <RaisedButton ng-click="toggle_search_term( $event )" data-key="commenter" data-id={commenter.id}>
                            <i class="mdi mdi-plus-circle-outline"></i>
                            <span>
                                {commenter.name}
                            </span>
                        </RaisedButton>
                      </li>
      							</div>
      						</ul>

      					</div>

      					<div class="dropdown">
      						<RaisedButton class="search-tool search-type-work dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Work
      							<i class="mdi mdi-chevron-down"></i>
      						</RaisedButton>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                      <li>
                        <RaisedButton ng-click="toggle_search_term( $event )" data-key="work" data-id={work.id}>
                            <i class="mdi mdi-plus-circle-outline"></i>
                            <span>{work.title}</span>
                        </RaisedButton>
                      </li>
      							</div>

      						</ul>

      					</div>

      					<div class="dropdown">
      						<RaisedButton class="search-tool search-type-book dropdown-toggle" type="button"
      								   id="dropdownMenu-keyword" data-toggle="dropdown" aria-haspopup="true"
      								   aria-expanded="true"
      						>
      							Book
      							<i class="mdi mdi-chevron-down"></i>
      						</RaisedButton>

      						<ul class="dropdown-menu" aria-labelledby="dropdownMenu-keyword">
      							<div class="dropdown-menu-inner">
                      <li>
                        <RaisedButton ng-click="toggle_search_term( $event )" data-key="book" data-id={subwork.id}>
                          <i class="mdi mdi-plus-circle-outline"></i>
                          <span>{subwork.work.title} {subwork.title}</span>
                        </RaisedButton>

                      </li>
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
      					<RaisedButton aria-label="Search" class="search-button" ng-click="toggle_search_mode()">
      						<i class="mdi mdi-magnify"></i>
      					</RaisedButton>
      				</div>
      			</div>
      		</md-toolbar>
      	</header>
      </div>
    )
  }
});
