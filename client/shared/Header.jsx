import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';

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

	toggleSearchMode() {
		if (location.pathname.indexOf('/commentary') === 0) {
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
			value.subworks[i].work = work;
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
					filters={this.props.filters}
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
											<FlatButton
												href="/profile"
												label="Profile"
												className=""
												style={styles.flatButton}
											/>
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
