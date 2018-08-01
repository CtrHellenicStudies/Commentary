import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import Headroom from 'react-headroom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import autoBind from 'react-autobind';

// components
import CommentarySearchToolbarContainer from '../../../../modules/search/containers/CommentarySearchToolbarContainer';
import CommentarySearchPanelContainer from '../../../../modules/search/containers/CommentarySearchPanelContainer';
import ProfileAvatarButton from '../../../../modules/users/components/ProfileAvatarButton';

// graphql
import tenantsQuery from '../../../../modules/tenants/graphql/queries/tenants';
import settingsQuery from '../../../../modules/settings/graphql/queries/list';

// actions
import { toggleLeftMenu } from '../../../../actions/leftMenu';

import './NavBar.css';


// styles
const styles = {
	flatButton: {
		width: 'auto',
		minWidth: 'none',
		height: '80px',
		lineHeight: '1.3em',
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
		};

		autoBind(this);
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

		if (
			nextProps.settingsQuery
			&& nextProps.settingsQuery.settings
			&& nextProps.tenantsQuery
			&& nextProps.tenantsQuery.tenants
		) {
			// TODO: move this to container
			this.setState({
				settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === this.props.tenantId),
				tenant: this.props.tenantsQuery.loading ? {} : this.props.tenantsQuery.tenants.find(x => x._id === this.props.tenantId),
			});
		}
	}

	renderUserAvatarOrLogin() {
		const { userId } = this.props;

		if (userId) {
			return (
				<div className="user-header-links">
					<ProfileAvatarButton
						showUserDropdown={this.showUserDropdown}
						hideUserDropdown={this.hideUserDropdown}
					/>
				</div>
			);
		}

		return (
			<div>
				<Link to="/auth/sign-in">
					<FlatButton
						label="Login"
						style={styles.flatButton}
						className="account-button account-button-login"
					/>
				</Link>
				<Link to="/auth/sign-in">
					<FlatButton
						label="Join the Community"
						style={styles.flatButton}
						className="account-button account-button-login"
					/>
				</Link>
			</div>
		);
	}

	render() {
		const { dispatchToggleLeftMenu } = this.props;
		const { rightMenuOpen, searchEnabled, settings } = this.state;

		return (
			<Headroom
				className="navbar"
				style={{
					zIndex: 98,
				}}
			>
				<CommentarySearchPanelContainer
					open={rightMenuOpen}
					closeRightMenu={this.closeRightMenu}
				/>
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
									{this.renderUserAvatarOrLogin()}
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
										onClick={this.toggleSearchMode}
										iconClassName="material-icons">
										search
									</IconButton>
								</div>
								<div className="search-tools collapse">
									<CommentarySearchToolbarContainer />
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
	userId: PropTypes.string,
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
	roles: state.auth.roles,
	leftMenuOpen: state.leftMenu.open,
	commenters: state.auth.commenters,
	tenantId: state.tenant.tenantId,
});

const mapDispatchToProps = dispatch => ({
	dispatchToggleLeftMenu: () => {
		dispatch(toggleLeftMenu(true));
	},
});

export default compose(
	tenantsQuery,
	settingsQuery,
	connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
