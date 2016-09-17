
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {debounce} from 'throttle-debounce';


AddCommentHeader = React.createClass({

    propTypes: {
        toggleSearchTerm: React.PropTypes.func,
    },

    getChildContext() {
        return {
            muiTheme: getMuiTheme(baseTheme)
        };
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            leftMenuOpen: false,
            searchEnabled: true,
            searchDropdownOpen: "",
            subworks: [],
            activeWork: "",
            modalLoginLowered: false,
            modalSignupLowered: false
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {

        return {
            works: Works.find({}, {
                sort: {
                    order: 1
                }
            }).fetch(),
            subworks: Subworks.find({}, {
                sort: {
                    n: 1
                }
            }).fetch(),
        }
    },

    toggleSearchMode() {

        this.setState({
            searchEnabled: !this.state.searchEnabled
        });
    },

    toggleLeftMenu() {
        this.setState({
            leftMenuOpen: !this.state.leftMenuOpen
        });
    },

    closeLeftMenu() {
        this.setState({
            leftMenuOpen: false
        });
    },

    toggleSearchDropdown(targetDropdown) {
        if (this.state.searchDropdownOpen === targetDropdown) {
            this.setState({
                searchDropdownOpen: ""
            });

        } else {
            this.setState({
                searchDropdownOpen: targetDropdown
            });

        }
    },

    toggleSearchTerm(key, value){
        this.props.toggleSearchTerm(key, value);

    },

    toggleWorkSearchTerm(key, value) {
        var work = value;

        value.subworks.forEach(function(subwork) {
            subwork.work = work;
        });

        //console.log("Header.state", this.state);

        if (this.state.activeWork === value.slug) {
            this.setState({
                subworks: [],
                activeWork: ""
            });

        } else {
            value.subworks.sort(function(a, b) {
                if (a.n < b.n)
                    return -1;
                if (a.n > b.n)
                    return 1;
                return 0;

            });
            this.setState({
                subworks: value.subworks,
                activeWork: value.slug
            });

        }

        this.props.toggleSearchTerm(key, value);

    },

    showLoginModal(){
        this.setState({
            modalLoginLowered: true
        });

    },
    showSignupModal(){
        this.setState({
            modalSignupLowered: true
        });

    },
    closeLoginModal(){
        this.setState({
            modalLoginLowered: false
        });

    },
    closeSignupModal(){
        this.setState({
            modalSignupLowered: false
        });

    },

    render() {
        var self = this;

        let styles = {
            flatButton: {
                width: "auto",
                minWidth: "none",
                height: "80px",
                padding: "21px 5px"
            },
            flatIconButton: {
                padding: "10px 20px",
                width: "auto",
                minWidth: "none",
                height: "55px",

            }

        };

    var user_is_loggedin = Meteor.user();

    var work = {id:1};
    var subwork = {work:{title:"Iliad"},id:1, title:"1"};

    return (
        <div>

            <LeftMenu
                open={this.state.leftMenuOpen}
                closeLeftMenu={this.closeLeftMenu}
            />

            <header>
                {!this.state.searchEnabled ?

                    <div className="md-menu-toolbar" >

                        <div className="toolbar-tools">

                            <IconButton
                                className="left-drawer-toggle"
                                style={styles.flatIconButton}
                                iconClassName="mdi mdi-menu"
                                onClick={this.toggleLeftMenu}
                            />

                            <a href="/" className="header-home-link">
                                <h3 className="logo">A Homer Commentary in Progress</h3>
                            </a>

                            <div className="search-toggle">
                                <IconButton
                                    className="search-button"
                                    onClick={this.toggleSearchMode}
                                    iconClassName="mdi mdi-magnify"
                                />

                            </div>

                            <div className="header-section-wrap nav-wrap" >
                                <FlatButton
                                    label="Commentary"
                                    href="/commentary/"
                                    style={styles.flatButton}
                                />
                                <FlatButton
                                    label="About"
                                    href="/about"
                                    style={styles.flatButton}
                                />
                                {user_is_loggedin ?
                                    <div>
                                        <FlatButton
                                          href="/profile"
                                          label="Profile"
                                          className=""
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
                                            style={styles.flatButton}
                                        />
                                        <FlatButton
                                            href="#"
                                            label="Join the Community"
                                            onClick={this.showSignupModal}
                                            style={styles.flatButton}
                                        />
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

                                <div className={"dropdown search-dropdown search-dropdown-works" + (this.state.searchDropdownOpen === "work" ? " open" : "")}>

                                    <FlatButton
                                        className="search-tool search-type-work dropdown-toggle"
                                        label="Work"
                                        labelPosition="before"
                                        icon={<FontIcon className="mdi mdi-chevron-down" />}
                                        onClick={self.toggleSearchDropdown.bind(null, "work")}
                                    />

                                    <ul className="dropdown-menu">

                                        <div className="dropdown-menu-inner">

                                            {self.data.works.map(function(work, i){

                                                var activeWork = (self.state.activeWork === work.slug);
                                                return (
                                                    <SearchTermButton
                                                        key={i}
                                                        toggleSearchTerm={self.toggleWorkSearchTerm}
                                                        label={work.title}
                                                        searchTermKey="works"
                                                        value={work}
                                                        activeWork={activeWork}
                                                    />
                                                )
                                            })}

                                        </div>

                                        <IconButton
                                            className="close-dropdown"
                                            iconClassName="mdi mdi-close"
                                            onClick={this.toggleSearchDropdown.bind(null, "work")}
                                        />

                                    </ul>

                                </div>

                                <div className={"dropdown search-dropdown search-dropdown-book" + (this.state.searchDropdownOpen === "subwork" ? " open" : "") }>

                                    <FlatButton
                                        className="search-tool search-type-subwork dropdown-toggle"
                                        label="Book"
                                        labelPosition="before"
                                        icon={<FontIcon className="mdi mdi-chevron-down" />}
                                        onClick={self.toggleSearchDropdown.bind(null, "subwork")}
                                    />

                                    <ul className="dropdown-menu">

                                        <div className="dropdown-menu-inner">
                                            {self.state.subworks.map(function(subwork, i){
                                                return (
                                                    <SearchTermButton
                                                        key={i}
                                                        toggleSearchTerm={self.toggleSearchTerm}
                                                        label={subwork.work.title + " " + subwork.title}
                                                        searchTermKey="subworks"
                                                        value={subwork}
                                                    />
                                                )
                                            })}

                                        </div>

                                            <IconButton
                                                className="close-dropdown"
                                                iconClassName="mdi mdi-close"
                                                onClick={this.toggleSearchDropdown.bind(null, "subwork")}
                                            />

                                    </ul>

                                </div>

                            </div>

                            <div className="search-toggle">
                                <IconButton
                                    className="search-button"
                                    onClick={this.toggleSearchMode}
                                    iconClassName="mdi mdi-magnify"
                                />

                            </div>

                        </div>

                    </div>
                }

            </header>

            <ModalLogin
                lowered={this.state.modalLoginLowered}
                closeModal={this.closeLoginModal}
            />

            <ModalSignup
                lowered={this.state.modalSignupLowered}
                closeModal={this.closeSignupModal}
            />

       </div>
    )}
});
