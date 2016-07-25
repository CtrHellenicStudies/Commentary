
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


Header = React.createClass({

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      leftMenuOpen : false,
      searchEnabled : false,
      searchDropdownOpen : "",
      searchTerms : []
    };
  },

  toggleSearchMode(){
    this.setState({
      searchEnabled : !this.state.searchEnabled
    });
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

  toggleSearchDropdown(){
    this.setState({
    });
  },

  toggleSearchTerm(){
    this.setState({
    });
  },


  render(){

    let styles = {
      flatButton : {
        width: "auto",
        minWidth: "none",
        height: "60px",
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

    console.log("Header.state", this.state);

    return (
      <div>
        <LeftMenu
          open={this.state.leftMenuOpen}
          closeLeftMenu={this.closeLeftMenu}
          />
      	<header headroom>
          {!this.state.searchEnabled ?

        		<div className="md-menu-toolbar" >
        			<div className="toolbar-tools">

                <FlatButton
                  className="left-drawer-toggle"
                  style={styles.flatIconButton}
                  icon={<FontIcon className="mdi mdi-menu" />}
                  onClick={this.toggleLeftMenu}
                />

                <a href="/" className="header-home-link" >
        					<h3 className="logo">A Homer Commentary in Progress</h3>
        				</a>

        				<div className="search-toggle">
        					<IconButton
                    className="search-button"
                    onClick={this.toggleSearchMode}
                    iconClassName="mdi mdi-magnify"
                    >

        					</IconButton>
        				</div>

        				<div className="header-section-wrap nav-wrap" >
        					<FlatButton
                    label="Commentary"
                    href="/commentary/"
                    linkButton={true}
                    style={styles.flatButton}
                    >
        					</FlatButton>
        					<FlatButton
                    label="About"
                    href="/about"
                    linkButton={true}
                    style={styles.flatButton}
                    ></FlatButton>
                  {user_is_loggedin ?
                      <div>
                        <FlatButton
                          label="Profile"
                          className=""
                          linkButton={true}
                          style={styles.flatButton}
                          >
                        </FlatButton>
                      </div>
                    :
                      <div>
                        <FlatButton
                          href="#"
                          label="Login"
                          onClick={this.showLoginModal}
                          linkButton={true}
                          style={styles.flatButton}
                          >
                        </FlatButton>
                        <FlatButton
                          href="#"
                          label="Join the Community"
                          onClick={this.showJoinModal}
                          linkButton={true}
                          style={styles.flatButton}
                          >
                        </FlatButton>
                      </div>
                  }
        				</div>

        			</div>

        		</div>

          :
        		<div className="md-menu-toolbar" >
        			<div className="toolbar-tools">

                <FlatButton
                  className="left-drawer-toggle"
                  style={styles.flatIconButton}
                  icon={<FontIcon className="mdi mdi-menu" />}
                  onClick={this.toggleLeftMenu}
                />

        				<div className="search-tools">

        					<div className="search-tool text-search">
                    <TextField
                        hintText=". . ."
                        floatingLabelText="Search"
                      />
        					</div>

        					<div className="dropdown search-dropdown search-dropdown-keywords">
        						<FlatButton
                      className="search-tool search-type-keyword dropdown-toggle"
                      label="Keyword"
                      icon={<FontIcon className="mdi mdi-chevron-down" />}
                      onClick={this.toggleSearchDropdown}
        						>
        						</FlatButton>

        						<ul className="dropdown-menu">
        							<div className="dropdown-menu-inner">
                        <li>
                          <FlatButton
                            onClick={this.toggleSearchTerm}
                            data-key="keyword"
                            data-id={keyword.id}
                            >
                              <i className="mdi mdi-plus-circle-outline"></i>
                              <span>
                                  {keyword.title}
                              </span>
                          </FlatButton>

                        </li>
        							</div>
        						</ul>

        					</div>

        					<div className="dropdown search-dropdown search-dropdown-commenters">
        						<FlatButton
                      className="search-tool search-type-keyword dropdown-toggle"
                      label="Commenter"
                      icon={<FontIcon className="mdi mdi-chevron-down" />}
                      onClick={this.toggleSearchDropdown}
        						>
                    </FlatButton>

        						<ul className="dropdown-menu">
        							<div className="dropdown-menu-inner">
                        <li>
                          <FlatButton
                            onClick={this.toggleSearchTerm}
                            data-key="commenter"
                            data-id={commenter.id}
                            >
                              <i className="mdi mdi-plus-circle-outline"></i>
                              <span>
                                  {commenter.name}
                              </span>
                          </FlatButton>
                        </li>
        							</div>
        						</ul>

        					</div>

        					<div className="dropdown search-dropdown search-dropdown-work">
        						<FlatButton
                      className="search-tool search-type-keyword dropdown-toggle"
                      label="Work"
                      icon={<FontIcon className="mdi mdi-chevron-down" />}
                      onClick={this.toggleSearchDropdown}
        						>
                    </FlatButton>

        						<ul className="dropdown-menu">
        							<div className="dropdown-menu-inner">
                        <li>
                          <FlatButton
                            onClick={this.toggleSearchTerm}
                            data-key="work"
                            data-id={work.id}
                            >
                              <i className="mdi mdi-plus-circle-outline"></i>
                              <span>{work.title}</span>
                          </FlatButton>
                        </li>
        							</div>

        						</ul>

        					</div>

        					<div className="dropdown search-dropdown search-dropdown-book">
        						<FlatButton
                      className="search-tool search-type-keyword dropdown-toggle"
                      label="Book"
                      icon={<FontIcon className="mdi mdi-chevron-down" />}
                      onClick={this.toggleSearchDropdown}
        						>
                    </FlatButton>

        						<ul className="dropdown-menu">
        							<div className="dropdown-menu-inner">
                        <li>
                          <FlatButton
                            onClick={this.toggleSearchTerm}
                            data-key="subwork"
                            data-id={subwork.id}
                            >
                            <i className="mdi mdi-plus-circle-outline"></i>
                            <span>{subwork.work.title} {subwork.title}</span>
                          </FlatButton>

                        </li>
        							</div>


        						</ul>

        					</div>
        					<div className="search-tool text-search line-search">
        						<label>Line</label>
                     <TextField
                        hintText="00"
                        floatingLabelText="From"
                      />
                    <TextField
                        hintText="00"
                        floatingLabelText="To"
                      />
        					</div>
        				</div>

        				<div className="search-toggle">
        					<IconButton
                    className="search-button"
                    onClick={this.toggleSearchMode}
                    iconClassName="mdi mdi-magnify"
                    >

        					</IconButton>
        				</div>

        			</div>
        		</div>
          }
      	</header>
      </div>
    )
  }
});
