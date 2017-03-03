import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import Settings from '/imports/collections/settings';
import Tenants from '/imports/collections/tenants';

Header = React.createClass({

	mixins: [ReactMeteorData],

	propTypes: {
		filters: React.PropTypes.array.isRequired,
		toggleSearchTerm: React.PropTypes.func.isRequired,
		handleChangeTextsearch: React.PropTypes.func.isRequired,
		handleChangeLineN: React.PropTypes.func.isRequired,
		initialSearchEnabled: React.PropTypes.bool,
		addCommentPage: React.PropTypes.bool,

	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

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
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get("tenantId"));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : {},
			tenant: Tenants.findOne({ _id: Session.get("tenantId") })
		};
	},

	toggleSearchMode() {
		if (
					location.pathname.indexOf('/commentary') === 0 ||
					this.props.addCommentPage
				) {
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

		value.subworks.forEach((subwork, subworkIndex) => {
			value.subworks[subworkIndex].work = work;
		});

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
			lineSearch: {
				width: 250,
				padding: '10px 15px',
			},

		};

		const userIsLoggedIn = Meteor.user();
		const filters = this.props.filters;

		const { tenant } = this.data;

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
					filters={filters}
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
									<h3 className="logo">{this.data.settings ? this.data.settings.name : undefined}</h3>
								</a>
								{tenant && !tenant.isAnnotation &&
									<div className="search-toggle">
										<IconButton
											className="search-button right-drawer-toggle"
											onClick={this.toggleRightMenu}
											iconClassName="mdi mdi-magnify"
										/>
									</div>
								}
								<div className="header-section-wrap nav-wrap collapse" >
									{tenant && !tenant.isAnnotation &&
										<span>
											<FlatButton
												label="Commentary"
												href="/commentary"
												style={styles.flatButton}
											/>
											<FlatButton
												label="About"
												href="/about"
												style={styles.flatButton}
											/>
										</span>
									}
									{userIsLoggedIn ?
										<div>
											{Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter']) ?
												<div className="user-header-links admin-header-links">
													<FlatButton
														href="/profile"
														label="Profile"
														className=""
														style={styles.flatButton}
													/>
													{tenant && !tenant.isAnnotation &&
														<span>
															<FlatButton
																href="/commentary/add"
																label="Add Comment"
																className=""
																style={styles.flatButton}
															/>
															<FlatButton
																href="/keywords/add"
																label="Add Keyword/Idea"
																className=""
																style={styles.flatButton}
															/>
														</span>
													}
												</div>
												:
												<div className="user-header-links">
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
												label="Login"
												onClick={tenant && !tenant.isAnnotation ? this.showLoginModal : undefined}
												href={tenant && tenant.isAnnotation ? "/sign-in" : ""}
												style={styles.flatButton}
												className="account-button account-button-login"
											/>
											<FlatButton
												label="Join the Community"
												onClick={tenant && !tenant.isAnnotation ? this.showSignupModal : undefined}
												href={tenant && tenant.isAnnotation ? "/sign-up" : ""}
												style={styles.flatButton}
												className="account-button account-button-login"
											/>
										</div>
									}
									{tenant && !tenant.isAnnotation &&
										<div className="search-toggle">
											<IconButton
												className="search-button"
												onClick={this.toggleSearchMode}
												iconClassName="mdi mdi-magnify"
											/>
										</div>
									}
								</div>
							</div>
						</div>
					:
						<div>
							{tenant && !tenant.isAnnotation &&
								<div className="md-menu-toolbar" > {/* Search toolbar for /commentary */}
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
												filters={filters}
												addCommentPage={this.props.addCommentPage}
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
						</div>
					}
				</header>

				{this.state.modalLoginLowered ?
					<ModalLogin
						lowered={this.state.modalLoginLowered}
						closeModal={this.closeLoginModal}
					/>
					: ''
				}
				{this.state.modalSignupLowered ?
					<ModalSignup
						lowered={this.state.modalSignupLowered}
						closeModal={this.closeSignupModal}
					/>
					: ''
				}
			</div>
		);
	},
});
