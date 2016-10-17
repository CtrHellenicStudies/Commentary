
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

Header = React.createClass({

    propTypes: {
    	filters: React.PropTypes.array,
      toggleSearchTerm: React.PropTypes.func,
      handleChangeTextsearch: React.PropTypes.func,
      handleChangeLineN: React.PropTypes.func,
      initialSearchEnabled: React.PropTypes.bool,
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            leftMenuOpen: false,
            rightMenuOpen: false,
            searchEnabled: this.props.initialSearchEnabled,
            addCommentPage: false,
            searchDropdownOpen: '',
            subworks: [],
            activeWork: '',
            modalLoginLowered: false,
            modalSignupLowered: false,
        };
    },

    getChildContext() {
        return { muiTheme: getMuiTheme(baseTheme) };
    },

    getMeteorData() {
        return {
            keywords: Keywords.find().fetch(),
            commenters: Commenters.find().fetch(),
            works: Works.find({}, { sort: { order: 1 } }).fetch(),
            subworks: Subworks.find({}, { sort: { n: 1 } }).fetch(),
        };
    },

    componentWillMount() {
        if (location.pathname.indexOf('/add-comment') === 0) {
            this.setState({
                addCommentPage: true,
            });
        };
    },

    componentDidUpdate() {
        if (location.pathname.indexOf('/add-comment') === 0 && !this.state.addCommentPage) {
            this.setState({
                addCommentPage: true,
            });
        };
    },

    toggleSearchMode() {
        if (location.pathname.indexOf('/commentary') === 0 || location.pathname.indexOf('/add-comment') === 0) {
            this.setState({
                searchEnabled: !this.state.searchEnabled,
            });
        } else {
            location.href = '/commentary';
        }
    },

    toggleLeftMenu() {
        this.setState({
            leftMenuOpen: !this.state.leftMenuOpen,
        });
    },

    closeLeftMenu() {
        this.setState({
            leftMenuOpen: false,
        });
    },

    toggleRightMenu() {
        this.setState({
            rightMenuOpen: !this.state.rightMenuOpen,
        });
        console.log(this.state.rightMenuOpen);
    },

    closeRightMenu() {
        this.setState({
            rightMenuOpen: false,
        });
    },

    toggleSearchDropdown(targetDropdown) {
        if (this.state.searchDropdownOpen === targetDropdown) {
            this.setState({
                searchDropdownOpen: '',
            });
        } else {
            this.setState({
                searchDropdownOpen: targetDropdown,
            });
        }
    },

    toggleSearchTerm(key, value) {
        this.props.toggleSearchTerm(key, value);
    },

    handleChangeTextsearch(event) {
        this.props.handleChangeTextsearch(event.target.value);
    },

    toggleWorkSearchTerm(key, value) {
        const work = value;

        value.subworks.forEach((subwork, i) => {
            subwork.work = work;
        });

        // console.log("Header.state", this.state);

        if (this.state.activeWork === value.slug) {
            this.setState({
                subworks: [],
                activeWork: '',
            });
        } else {
            value.subworks.sort((a, b) => {
                if (a.n < b.n) {
                    return -1;
                }
                if (a.n > b.n) {
                    return 1;
                }
                return 0;
            });
            this.setState({
                subworks: value.subworks,
                activeWork: value.slug,
            });
        }

        this.props.toggleSearchTerm(key, value);
    },

    showLoginModal() {
        this.setState({
            modalLoginLowered: true,
        });
    },
    showSignupModal() {
        this.setState({
            modalSignupLowered: true,
        });
    },
    closeLoginModal() {
        this.setState({
            modalLoginLowered: false,
        });
    },
    closeSignupModal() {
        this.setState({
            modalSignupLowered: false,
        });
    },

    render() {
        const self = this;

        const styles = {
            flatButton: {
                width: 'auto',
                minWidth: 'none',
                height: '80px',
                padding: '25px 5px',
            },
            flatIconButton: {
                padding: '10px 20px',
                width: 'auto',
                minWidth: 'none',
                height: '55px',

            },

        };

        const userIsLoggedIn = Meteor.user();

        // const active_comment = false;
        // const username = false;

        // const keyword = { id: 1 };
        // const commenter = { id: 1 };
        // const work = { id: 1 };
        // const subwork = { work: { title: 'Iliad' }, id: 1, title: '1' };

        // console.log("Header.state", this.state);
        // console.log("Header.data", this.data);

        return (
            <div>
                <LeftMenu
                    open={this.state.leftMenuOpen}
                    closeLeftMenu={this.closeLeftMenu}
                />
                <CommentarySearchPanel
                    toggleSearchTerm={this.props.toggleSearchTerm}
                    handleChangeTextsearch={this.props.handleChangeTextsearch}
                    handleChangeLineN={this.props.handleChangeLineN}
                    open={this.state.rightMenuOpen}
                    closeRightMenu={this.closeRightMenu}
                />
                <header >
                    {!this.state.searchEnabled ?

                        <div className="md-menu-toolbar" >
                            <div className="toolbar-tools">
                                <IconButton
                                    className="left-drawer-toggle"
                                    style={styles.flatIconButton}
                                    iconClassName="mdi mdi-menu"
                                    onClick={this.toggleLeftMenu}
                                />

                                <a href="/" className="header-home-link" >
                                    <h3 className="logo">A Homer Commentary in Progress</h3>
                                </a>
                                <div className="search-toggle">
                                    <IconButton
                                        className="search-button right-drawer-toggle"
                                        onClick={this.toggleRightMenu}
                                        iconClassName="mdi mdi-magnify"
                                    />
                                </div>
                                <div className="header-section-wrap nav-wrap collapse" >
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
                                    {userIsLoggedIn ?
                                        <div>
                                            {Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter']) ?
                                                <div>
                                                    <FlatButton
                                                        href="/profile"
                                                        label="Profile"
                                                        className=""
                                                        style={styles.flatButton}
                                                    />
                                                    <FlatButton
                                                        href="/add-comment"
                                                        label="Add Comment"
                                                        className=""
                                                        style={styles.flatButton}
                                                    />
                                                </div>
                                                :
                                                <div>
                                                    <FlatButton
                                                        href="/profile"
                                                        label="Profile"
                                                        className=""
                                                        style={styles.flatButton}
                                                    />
                                                </div>
                                            }
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
                                    <div className="search-toggle">
                                        <IconButton
                                            className="search-button"
                                            onClick={this.toggleSearchMode}
                                            iconClassName="mdi mdi-magnify"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        :

                        <div>
                            {!this.state.addCommentPage ?
                                <div className="md-menu-toolbar" >
                                    <div className="toolbar-tools">

                                        <IconButton
                                            className="left-drawer-toggle"
                                            style={styles.flatIconButton}
                                            iconClassName="mdi mdi-menu"
                                            onClick={this.toggleLeftMenu}
                                        />

                                        <div className="search-toggle">
                                            <IconButton
                                                className="search-button right-drawer-toggle"
                                                onClick={this.toggleRightMenu}
                                                iconClassName="mdi mdi-magnify"
                                            />
                                        </div>

                                        <div className="search-tools collapse">

                                            <CommentarySearchToolbar
                                            	toggleSearchTerm={this.props.toggleSearchTerm}
			                                        handleChangeTextsearch={this.props.handleChangeTextsearch}
			                                        handleChangeLineN={this.props.handleChangeLineN}
			                                        filters={this.props.filters}
				                                    />

                                            <div className="search-toggle">
                                                <IconButton
                                                    className="search-button"
                                                    onClick={this.toggleSearchMode}
                                                    iconClassName="mdi mdi-magnify"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                :
                                <div className="md-menu-toolbar" >

                                    <div className="toolbar-tools">

                                        <IconButton
                                            className="left-drawer-toggle"
                                            style={styles.flatIconButton}
                                            iconClassName="mdi mdi-menu"
                                            onClick={this.toggleLeftMenu}
                                        />

                                        <div className="search-tools collapse">

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
																						<div style={styles.lineSearch} className="line-search">
																							<LineRangeSlider
																								handleChangeLineN={this.props.handleChangeLineN}
																							/>
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

                                </div>
                        }
                        </div>
                    }
                </header>
                {this.state.modalLoginLowered ?
                    <ModalLogin
                        lowered={this.state.modalLoginLowered}
                        closeModal={this.closeLoginModal}
                    />
                    :
                    ''
                }
                {this.state.modalSignupLowered ?
                    <ModalSignup
                        lowered={this.state.modalSignupLowered}
                        closeModal={this.closeSignupModal}
                    />
                    :
                    ''
                }
            </div>
        );
    },
});
