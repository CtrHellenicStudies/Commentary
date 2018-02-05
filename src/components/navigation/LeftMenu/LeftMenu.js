import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// components
import { toggleLeftMenu } from '../../../actions/leftMenu';
import MenuItem from '../MenuItem';
import MenuSubItem from '../MenuSubItem';
import LeftMenuHead from '../LeftMenuHead';

// actions
import { logout, toggleAuthModal } from '../../../modules/auth/actions';
import { logoutUser } from '../../../lib/auth';

// lib
import getCurrentProjectHostname from '../../../lib/getCurrentProjectHostname';
import Utils from '../../../lib/utils';



class LeftMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tenantId: sessionStorage.getItem('tenantId')
		};
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			currentUser: Cookies.get('user')
		});
	}

	render() {
		const {
			leftMenuOpen, closeLeftMenu, userId, dispatchLogout,
			dispatchToggleAuthModal
		} = this.props;
		const { currentUser } = this.state;

		let tenant;
		let settings;
		const user = Cookies.get('user') ? Cookies.get('user') : undefined;

		/*
		 * TODO move query to container with compose
		if (
			!this.props.tenantsQuery.loading
			&& this.props.tenantsQuery.tenants
		) {
			tenant = this.props.tenantsQuery.tenants.find(x => x._id === this.state.tenantId);
		}

		if (
			!this.props.settingsQuery.loading
			&& this.props.settingsQuery.settings
		) {
		 	settings = this.props.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId);
		}
		*/

		return (
			<Drawer
				open={leftMenuOpen}
				docked={false}
				onRequestChange={closeLeftMenu}
				className="leftMenu"
			>
				<LeftMenuHead />
				<div className="leftMenuContent">
					{(
							tenant
						&& !tenant.isAnnotation
						&& user
						&& Utils.userInRole(user, ['editor', 'admin', 'commenter'])
					) ?
						<div>
              {(
									tenant
								&& !tenant.isAnnotation
								&& Utils.userInRole(user, ['admin'])
							) ?
								<MenuItem
									href="http://ahcip-admin.chs.harvard.edu"
									target="_blank"
									primaryText="Admin"
									onClick={closeLeftMenu}
								/>
							:
							''}
							<Link to="/commentary/create">
								<MenuItem
									primaryText="Add Comment"
									onClick={closeLeftMenu}
								/>
							</Link>
							<Link to="/tags/create">
								<MenuItem
									primaryText="Add Tag"
									onClick={closeLeftMenu}
								/>
							</Link>
							<Link to="/textNodes/edit">
								<MenuItem
									primaryText="Add Translation"
									onClick={closeLeftMenu}
								/>
							</Link>

							<Divider />
						</div>
					:
					'' }
					<MenuItem
						to="/"
						onClick={closeLeftMenu}
					>
						Home
					</MenuItem>
					<MenuItem
						to="/commentary"
						onClick={closeLeftMenu}
					>
						Commentary
					</MenuItem>
					<MenuItem
						to="/words"
						onClick={closeLeftMenu}
					>
						Words
					</MenuItem>
					<MenuItem
						to="/ideas"
						onClick={closeLeftMenu}
					>
						Ideas
					</MenuItem>
					<MenuItem
						to="/commentators"
						onClick={closeLeftMenu}
					>
						Commentators
					</MenuItem>
					<MenuItem
						to="/referenceWorks"
						onClick={closeLeftMenu}
					>
						Reference Works
					</MenuItem>
					<MenuItem
						to={settings && settings.aboutURL ? settings.aboutURL : '/about'}
						onClick={closeLeftMenu}
					>
						About
					</MenuItem>
					<MenuItem
						to="/#visualizations"
						onClick={closeLeftMenu}
					>
						Visualizations
					</MenuItem>
					<Divider />

					{user ?
						<div>
							<MenuItem
								to="/profile"
								onClick={closeLeftMenu}
							>
								Profile
							</MenuItem>
							<MenuItem
								to="/"
								onClick={closeLeftMenu}
							>
								Sign out
							</MenuItem>
						</div>
						:
						<MenuItem
							to={'#'}
							onClick={dispatchToggleAuthModal}
						>
							Sign up / in
						</MenuItem>
					}
				</div>
			</Drawer>
		);
	}
}


LeftMenu.propTypes = {
	project: PropTypes.object,
	leftMenuOpen: PropTypes.bool,
	closeLeftMenu: PropTypes.func,
};

LeftMenu.defaultProps = {
	project: {
		userIsAdmin: false,
	},
};

const mapStateToProps = (state, props) => ({
	leftMenuOpen: state.leftMenu.open,
	userId: state.auth.userId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	closeLeftMenu: () => {
		dispatch(toggleLeftMenu(false));
	},
	dispatchLogout: () => {
		dispatch(logout(logoutUser));
		dispatch(toggleLeftMenu(false));
	},
	dispatchToggleAuthModal: () => {
		dispatch(toggleAuthModal());
		dispatch(toggleLeftMenu(false));
	},
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(LeftMenu);
