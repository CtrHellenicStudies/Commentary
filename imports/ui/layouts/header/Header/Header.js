import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

// models:
import Settings from '/imports/models/settings';

// graphql
import { tenantsQuery } from '/imports/graphql/methods/tenants';

// layouts:
import ModalLogin from '/imports/ui/layouts/auth/ModalLogin';
import ModalSignup from '/imports/ui/layouts/auth/ModalSignup';
import ModalForgotPwd from '/imports/ui/layouts/auth/ModalForgotPwd';
import LeftMenu from '/imports/ui/layouts/header/LeftMenu';
import CommentarySearchToolbar from '/imports/ui/layouts/header/CommentarySearchToolbar';
import CommentarySearchPanel from '/imports/ui/layouts/header/CommentarySearchPanel';
import ProfileAvatarButton from '/imports/ui/components/header/ProfileAvatarButton';

/*
	helpers
*/
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
	leftMenuToggle: {
		padding: '5px 10px',
		width: 'auto',
		minWidth: 'none',
		height: 'auto',
		margin: '24px 20px',
	},
	lineSearch: {
		width: 250,
		padding: '10px 15px',
	},
};


/*
	BEGIN Header
*/
class Header extends Component {
	static propTypes = {
		filters: PropTypes.any, // eslint-disable-line react/forbid-prop-types
		toggleSearchTerm: PropTypes.func,
		handleChangeTextsearch: PropTypes.func,
		handleChangeLineN: PropTypes.func,
		initialSearchEnabled: PropTypes.bool,
		addCommentPage: PropTypes.bool,
		isOnHomeView: PropTypes.bool,
		isTest: PropTypes.bool,
		selectedWork: PropTypes.object,

		// from creatContainer:
		settings: PropTypes.shape({
			name: PropTypes.string,
		}),
		tenant: PropTypes.shape({
			subdomain: PropTypes.string,
			isAnnotation: PropTypes.bool,
		}),
		showSignup: PropTypes.func,
		showForgotPwd: PropTypes.func,
		history: PropTypes.any,
		user: PropTypes.object

	};

	static defaultProps = {
		filters: [],
		initialSearchEnabled: false,
		addCommentPage: false,
		isOnHomeView: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			leftMenuOpen: false,
			rightMenuOpen: false,
			searchEnabled: props.initialSearchEnabled,
			searchDropdownOpen: '',
			subworks: [],
			activeWork: '',
			modalLoginLowered: false,
			modalSignupLowered: !!props.showSignup,
			modalForgotPwdLowered: !!props.showForgotPwd,
		};

		// methods:
		this.toggleSearchMode = this.toggleSearchMode.bind(this);
		this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
		this.closeLeftMenu = this.closeLeftMenu.bind(this);
		this.toggleRightMenu = this.toggleRightMenu.bind(this);
		this.closeRightMenu = this.closeRightMenu.bind(this);
		this.toggleSearchDropdown = this.toggleSearchDropdown.bind(this);
		this.toggleWorkSearchTerm = this.toggleWorkSearchTerm.bind(this);
		this.showLoginModal = this.showLoginModal.bind(this);
		this.showSignupModal = this.showSignupModal.bind(this);
		this.closeLoginModal = this.closeLoginModal.bind(this);
		this.closeSignupModal = this.closeSignupModal.bind(this);
		this.closeForgotPwdModal = this.closeForgotPwdModal.bind(this);
	}

	toggleSearchMode() {

		const { addCommentPage } = this.props;
		const { searchEnabled } = this.state;

		if (location.pathname.indexOf('/commentary') === 0 || addCommentPage) {
			this.setState({
				searchEnabled: !searchEnabled,
			});
		} else location.href = '/commentary';
	}

	toggleLeftMenu() {
		this.setState({
			leftMenuOpen: !this.state.leftMenuOpen,
		});
	}

	closeLeftMenu() {
		this.setState({
			leftMenuOpen: false,
		});
	}

	toggleRightMenu() {
		this.setState({
			rightMenuOpen: !this.state.rightMenuOpen,
		});
	}

	closeRightMenu() {
		this.setState({
			rightMenuOpen: false,
		});
	}

	toggleSearchDropdown(targetDropdown) {

		const { searchDropdownOpen } = this.state;

		if (searchDropdownOpen === targetDropdown) {
			this.setState({
				searchDropdownOpen: '',
			});
		} else {
			this.setState({
				searchDropdownOpen: targetDropdown,
			});
		}
	}

	toggleWorkSearchTerm(key, value) {

		const { toggleSearchTerm } = this.props;
		const { activeWork } = this.state;

		value.subworks.forEach((subwork, subworkIndex) => {
			value.subworks[subworkIndex].work = value;
		});

		if (activeWork === value.slug) {
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

		toggleSearchTerm(key, value);
	}

	showLoginModal() {
		this.setState({
			modalLoginLowered: true,
		});
	}

	showSignupModal() {
		this.setState({
			modalSignupLowered: true,
		});
	}

	closeLoginModal() {
		this.setState({
			modalLoginLowered: false,
		});
	}

	closeSignupModal() {
		if (this.props.showSignup) {
			this.props.history.push('/');
		}
		this.setState({
			modalSignupLowered: false,
		});
	}

	closeForgotPwdModal() {
		if (this.props.showForgotPwd) {
			this.props.history.push('/');
		}
		this.setState({
			modalForgotPwdLowered: false,
		});
	}

	render() {

		const { filters, isOnHomeView, isTest, toggleSearchTerm, handleChangeTextsearch, handleChangeLineN, tenant, settings, addCommentPage, selectedWork } = this.props;
		const { leftMenuOpen, rightMenuOpen, searchEnabled, modalLoginLowered } = this.state;
		const modalSignupLowered = this.state.modalSignupLowered || this.props.showSignup;
		const modalForgotPwdLowered = this.state.modalForgotPwdLowered || this.props.showForgotPwd;
		return (
			<div>
				<LeftMenu
					open={leftMenuOpen}
					closeLeftMenu={this.closeLeftMenu}
				/>

				{!isOnHomeView && (
					toggleSearchTerm
					&& handleChangeTextsearch
					&& handleChangeLineN
				) ?
					<CommentarySearchPanel
						toggleSearchTerm={toggleSearchTerm}
						handleChangeTextsearch={handleChangeTextsearch}
						handleChangeLineN={handleChangeLineN}
						open={rightMenuOpen}
						closeRightMenu={this.closeRightMenu}
						filters={filters}
						isTest={isTest}
					/>
				: ''}
				<header >
					{!searchEnabled ?
						<div className="md-menu-toolbar" >
							<div className="toolbar-tools">
								<IconButton
									className="left-drawer-toggle"
									style={styles.leftMenuToggle}
									iconClassName="mdi mdi-menu"
									onClick={this.toggleLeftMenu}
								/>

								{tenant && tenant.isAnnotation ?
									<a href="//chs.harvard.edu" className="header-home-link" >
										<h3 className="logo">{settings ? settings.name : undefined}</h3>
									</a>
								:
									<Link to="/" className="header-home-link">
										<h3 className="logo">{settings ? settings.name : undefined}</h3>
									</Link>
								}

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
											<Link to="/commentary">
												<FlatButton
													label="Commentary"
													style={styles.flatButton}
												/>
											</Link>
											<Link to={settings && settings.aboutURL ? settings.aboutURL : '/about'}>
												<FlatButton
													label="About"
													style={styles.flatButton}
												/>
											</Link>
										</span>
									}
									{this.props.user ?
										<div>
											{Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
												<div className="user-header-links admin-header-links">
													{tenant && !tenant.isAnnotation &&
														<span>
															<Link to="/commentary/create">
																<FlatButton
																	label="Add Comment"
																	className=""
																	style={styles.flatButton}
																/>
															</Link>
															<Link to="/tags/create">
																<FlatButton
																	label="Add Tag"
																	className=""
																	style={styles.flatButton}
																/>
															</Link>
															<Link to="/textNodes/edit">
																<FlatButton
																	label="Add Translation"
																	className=""
																	style={styles.flatButton}
																/>
															</Link>
														</span>
													}
													<ProfileAvatarButton
														showUserDropdown={this.showUserDropdown}
														hideUserDropdown={this.hideUserDropdown}
													/>
												</div>
												:
												<div className="user-header-links">
													<ProfileAvatarButton
														showUserDropdown={this.showUserDropdown}
														hideUserDropdown={this.hideUserDropdown}
													/>
												</div>
											}
										</div>
									:
										<div>
											<Link to={tenant && tenant.isAnnotation ? '/sign-in' : ''}>
												<FlatButton
													label="Login"
													onClick={tenant && !tenant.isAnnotation ? this.showLoginModal : undefined}
													style={styles.flatButton}
													className="account-button account-button-login"
												/>
											</Link>
											<Link to={tenant && tenant.isAnnotation ? '/sign-up' : ''}>
												<FlatButton
													label="Join the Community"
													onClick={tenant && !tenant.isAnnotation ? this.showSignupModal : undefined}
													style={styles.flatButton}
													className="account-button account-button-login"
												/>
											</Link>
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
											style={styles.leftMenuToggle}
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

										{!isOnHomeView && (
											toggleSearchTerm
											&& handleChangeLineN
										) ?
											<div className="search-tools collapse">

												<CommentarySearchToolbar
													toggleSearchTerm={toggleSearchTerm}
													handleChangeTextsearch={handleChangeTextsearch}
													handleChangeLineN={handleChangeLineN}
													filters={filters}
													addCommentPage={addCommentPage}
													isTest={isTest}
													selectedWork={selectedWork}
												/>
												<div className="search-toggle">
													<IconButton
														className="search-button"
														onClick={this.toggleSearchMode}
														iconClassName="mdi mdi-magnify"
													/>
												</div>
											</div>
										: ''}
									</div>
								</div>
							}
						</div>
					}
				</header>

				{!this.props.user && modalLoginLowered &&
					<ModalLogin
						lowered={modalLoginLowered}
						closeModal={this.closeLoginModal}
						signupModal={this.showSignupModal}
						history={this.props.history}
					/>
				}
				{!this.props.user && modalSignupLowered &&
					<ModalSignup
						lowered={modalSignupLowered}
						closeModal={this.closeSignupModal}
						loginModal={this.showLoginModal}
					/>
				}
				{!this.props.user && modalForgotPwdLowered &&
				<ModalForgotPwd
					lowered={modalForgotPwdLowered}
					signupModal={this.showSignupModal}
					closeModal={this.closeForgotPwdModal}
				/>
				}
			</div>
		);
	}
}
/*
	END Header
*/

const cont = createContainer((props) => {

	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	if (Session.get('tenantId')) {
		props.tenantsQuery.refetch({
			tenantId: Session.get('tenantId')
		});
	}
	return {
		settings: Settings.findOne({}),
		tenant: props.tenantsQuery.loading ? {} : props.tenantsQuery.tenants[0],
		user: Meteor.user()
	};

}, Header);
export default compose(tenantsQuery)(cont);
