import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import Headroom from 'react-headroom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

// components
import CommentarySearchToolbar from '../../../../modules/search/components/CommentarySearchToolbar';
import CommentarySearchPanel from '../../../../modules/search/components/CommentarySearchPanel';
import ProfileAvatarButton from '../../../../modules/users/components/ProfileAvatarButton';

// lib
import Utils from '../../../../lib/utils';

// graphql
import { tenantsQuery } from '../../../../graphql/methods/tenants';
import settingsQuery from '../../../../modules/settings/graphql/queries/list';

// actions
import { toggleLeftMenu } from '../../../../actions/leftMenu';
import { toggleAuthModal } from '../../../../modules/auth/actions';

import './NavBar.css';


// styles
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


class NavBar extends React.Component {

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
			tenantId: sessionStorage.getItem('tenantId'),
		};

		// methods:
		this.toggleSearchMode = this.toggleSearchMode.bind(this);
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

		if (window.location.pathname.indexOf('/commentary') === 0 || addCommentPage) {
			this.setState({
				searchEnabled: !searchEnabled,
			});
		} else window.location.href = '/commentary';
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

	componentWillReceiveProps(nextProps) {
		// TODO: move this to container
		this.setState({
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId),
			tenant: this.props.tenantsQuery.loading ? {} : this.props.tenantsQuery.tenants.find(x => x._id === this.state.tenantId),
		});
	}

	render() {

		const {
			filters, isOnHomeView, toggleSearchTerm, handleChangeTextsearch, handlePagination,
			addCommentPage, selectedWork, dispatchToggleLeftMenu, userId,
			dispatchToggleAuthModal, roles
		} = this.props;
		const { rightMenuOpen, searchEnabled, settings, tenant } = this.state;

		return (
			<Headroom
				className="navbar"
				style={{
					zIndex: 98,
				}}
			>
				{!isOnHomeView && (
					toggleSearchTerm
				) ?
					<CommentarySearchPanel
						toggleSearchTerm={toggleSearchTerm}
						handleChangeTextsearch={handleChangeTextsearch}
						handlePagination={handlePagination}
						open={rightMenuOpen}
						closeRightMenu={this.closeRightMenu}
						filters={filters}
					/>
				: ''}
				<div>
					{!searchEnabled ?
						<div className="md-menu-toolbar" >
							<div className="toolbar-tools">
								<IconButton
									className="left-drawer-toggle"
									iconClassName="material-icons"
									style={styles.leftMenuToggle}
									onClick={dispatchToggleLeftMenu}>
										menu
								</IconButton>

								<Link to="/" className="header-home-link">
									<h3 className="logo">{settings ? settings.name : ''}</h3>
								</Link>

								<div className="header-section-wrap nav-wrap collapse" >
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
									{	Utils.userInRole(roles, ['admin']) ?
										(
											<div>

											</div>
										) : ''

									}
									{userId ?
										<div className="user-header-links">
											<ProfileAvatarButton
												showUserDropdown={this.showUserDropdown}
												hideUserDropdown={this.hideUserDropdown}
											/>
										</div>
									:
										<div>
											<Link to={tenant && tenant.isAnnotation ? '/sign-in' : ''}>
												<FlatButton
													label="Login"
													onClick={dispatchToggleAuthModal}
													style={styles.flatButton}
													className="account-button account-button-login"
												/>
											</Link>
											<Link to={tenant && tenant.isAnnotation ? '/sign-up' : ''}>
												<FlatButton
													label="Join the Community"
													onClick={dispatchToggleAuthModal}
													style={styles.flatButton}
													className="account-button account-button-login"
												/>
											</Link>
										</div>
									}
									<div className="search-toggle">
										<IconButton
											className="search-button"
											iconClassName="material-icons"
											onClick={this.toggleSearchMode}>
												search
										</IconButton>
									</div>
								</div>
							</div>
						</div>
					:
						<div className="md-menu-toolbar" > {/* Search toolbar for /commentary */}
							<div className="toolbar-tools">
								<IconButton
									className="left-drawer-toggle"
									iconClassName="material-icons"
									style={styles.leftMenuToggle}
									onClick={dispatchToggleLeftMenu}>
										menu
								</IconButton>
								<div className="search-toggle">
									<IconButton
										className="search-button right-drawer-toggle"
										onClick={this.toggleRightMenu}
										iconClassName="material-icons">
										search
									</IconButton>
								</div>
								<div className="search-tools collapse">
									<CommentarySearchToolbar
										work={this.props.work}
										toggleSearchTerm={toggleSearchTerm}
										handleChangeTextsearch={handleChangeTextsearch}
										handlePagination={handlePagination}
										filters={filters}
										addCommentPage={addCommentPage}
										selectedWork={selectedWork}
									/>
								</div>
							</div>
						</div>
					}
				</div>
			</Headroom>
		 );
	 }
 }

NavBar.propTypes = {
	toggleAuthModal: PropTypes.func.isRequired,
	userId: PropTypes.string,
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
	roles: state.auth.roles,
	leftMenuOpen: state.leftMenu.open,
	commenters: state.auth.commenters
});

const mapDispatchToProps = dispatch => ({
	dispatchToggleLeftMenu: () => {
		dispatch(toggleLeftMenu(true));
	},
	dispatchToggleAuthModal: (open) => {
		dispatch(toggleAuthModal(open));
	},
});

export default compose(
	tenantsQuery,
	settingsQuery,
	connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
