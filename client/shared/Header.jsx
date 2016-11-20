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
		works: React.PropTypes.array,
		keywords: React.PropTypes.array,
		commenters: React.PropTypes.array,
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

		value.subworks.forEach((subwork) => {
			subwork.work = work;
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

		return (
			<div>
				<LeftMenu
					open={this.state.leftMenuOpen}
					closeLeftMenu={this.closeLeftMenu}
				/>
				{/*<CommentarySearchPanel
					toggleSearchTerm={this.props.toggleSearchTerm}
					handleChangeTextsearch={this.props.handleChangeTextsearch}
					handleChangeLineN={this.props.handleChangeLineN}
					open={this.state.rightMenuOpen}
					closeRightMenu={this.closeRightMenu}
				/>*/}
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
												label="Login"
												onClick={this.showLoginModal}
												style={styles.flatButton}
												className="account-button account-button-login"
											/>
											<FlatButton
												label="Join the Community"
												onClick={this.showSignupModal}
												style={styles.flatButton}
												className="account-button account-button-login"
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
							{!this.props.addCommentPage ?
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
												works={this.props.works}
												keywords={this.props.keywords}
												commenters={this.props.commenters}
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
								<div className="md-menu-toolbar" > {/* Search toolbar for /add-comment */}
									<div className="toolbar-tools">
										<IconButton
											className="left-drawer-toggle"
											style={styles.flatIconButton}
											iconClassName="mdi mdi-menu"
											onClick={this.toggleLeftMenu}
										/>
										<div className="search-tools collapse">
											<SearchToolDropdown
												name="Work"
												open={this.state.searchDropdownOpen === 'Work'}
												toggle={this.toggleSearchDropdown}
												disabled={false}
											>
												{this.props.works.map((work, i) => {
													const activeWork = (this.state.activeWork === work.slug);
													return (
														<SearchTermButton
															key={i}
															toggleSearchTerm={this.toggleWorkSearchTerm}
															label={work.title}
															searchTermKey="works"
															value={work}
															activeWork={activeWork}
														/>
													);
												})}
											</SearchToolDropdown>
											<SearchToolDropdown
												name="Book"
												open={this.state.searchDropdownOpen === 'Book'}
												toggle={this.toggleSearchDropdown}
												disabled={this.state.subworks.length === 0}

											>
												{this.state.subworks.map((subwork, i) => {
													let active = false;
													filters.forEach((filter) => {
														if (filter.key === 'subworks') {
															filter.values.forEach((value) => {
																if (subwork.n === value.n) {
																	active = true;
																}
															});
														}
													});

													return (
														<SearchTermButton
															key={i}
															toggleSearchTerm={this.toggleSearchTerm}
															label={`${subwork.work.title} ${subwork.title}`}
															searchTermKey="subworks"
															value={subwork}
															active={active}
														/>
													);
												})}
											</SearchToolDropdown>
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