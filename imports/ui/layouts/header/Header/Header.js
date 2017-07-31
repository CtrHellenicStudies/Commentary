import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

// api:
import Settings from '/imports/api/collections/settings';
import Tenants from '/imports/api/collections/tenants';

// layouts:
import ModalLogin from '/imports/ui/layouts/auth/ModalLogin';
import ModalSignup from '/imports/ui/layouts/auth/ModalSignup';
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
class Header extends React.Component {
	static propTypes = {
		filters: React.PropTypes.any, // eslint-disable-line react/forbid-prop-types
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func,
		initialSearchEnabled: React.PropTypes.bool,
		addCommentPage: React.PropTypes.bool,
		isOnHomeView: React.PropTypes.bool,
		isTest: React.PropTypes.bool,
		selectedWork: React.PropTypes.object,

		// from creatContainer:
		settings: React.PropTypes.shape({
			name: React.PropTypes.string,
		}),
		tenant: React.PropTypes.shape({
			subdomain: React.PropTypes.string,
			isAnnotation: React.PropTypes.bool,
		}),

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
			modalSignupLowered: false,
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
		this.setState({
			modalSignupLowered: false,
		});
	}

	render() {

		const { filters, isOnHomeView, isTest, toggleSearchTerm, handleChangeTextsearch, handleChangeLineN, tenant, settings, addCommentPage, selectedWork } = this.props;
		const { leftMenuOpen, rightMenuOpen, searchEnabled, modalSignupLowered, modalLoginLowered } = this.state;

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
									<a href="/" className="header-home-link" >
										<h3 className="logo">{settings ? settings.name : undefined}</h3>
									</a>
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
									{Meteor.user() ?
										<div>
											{Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
												<div className="user-header-links admin-header-links">
													{tenant && !tenant.isAnnotation &&
														<span>
															<FlatButton
																href="/commentary/create"
																label="Add Comment"
																className=""
																style={styles.flatButton}
															/>
															<FlatButton
																href="/tags/create"
																label="Add Tag"
																className=""
																style={styles.flatButton}
															/>
															<FlatButton
																href="/translation/create"
																label="Add Translation"
																className=""
																style={styles.flatButton}
															/>
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
											<FlatButton
												label="Login"
												onClick={tenant && !tenant.isAnnotation ? this.showLoginModal : undefined}
												href={tenant && tenant.isAnnotation ? '/sign-in' : ''}
												style={styles.flatButton}
												className="account-button account-button-login"
											/>
											<FlatButton
												label="Join the Community"
												onClick={tenant && !tenant.isAnnotation ? this.showSignupModal : undefined}
												href={tenant && tenant.isAnnotation ? '/sign-up' : ''}
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

				{!Meteor.user() && modalLoginLowered &&
					<ModalLogin
						lowered={modalLoginLowered}
						closeModal={this.closeLoginModal}
					/>
				}
				{!Meteor.user() && modalSignupLowered &&
					<ModalSignup
						lowered={modalSignupLowered}
						closeModal={this.closeSignupModal}
					/>
				}
			</div>
		);
	}
}
/*
	END Header
*/

export default createContainer(() => {

	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: Settings.findOne({}),
		tenant: Tenants.findOne({ _id: Session.get('tenantId') }),
	};

}, Header);
