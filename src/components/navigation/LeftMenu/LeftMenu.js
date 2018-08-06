import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// components
import { toggleLeftMenu } from '../../../actions/leftMenu';
import MenuItem from '../MenuItem';
import LeftMenuHead from '../LeftMenuHead';

// actions
import { logout, toggleAuthModal } from '../../../modules/auth/actions';
import { logoutUser } from '../../../lib/auth';

// lib
import userInRole from '../../../lib/userInRole';


import './LeftMenu.css';


class LeftMenu extends React.Component {
	render() {
		const {
			leftMenuOpen, closeLeftMenu, userId, dispatchLogout,
			dispatchToggleAuthModal, roles, settings
		} = this.props;

		return (
			<Drawer
				open={leftMenuOpen}
				docked={false}
				onRequestChange={closeLeftMenu}
				className="leftMenu"
			>
				<LeftMenuHead />
				<div className="leftMenuContent">
					{userInRole(roles, ['admin']) ?
						<MenuItem
							to="/admin"
							onClick={closeLeftMenu}
						>
							Admin
						</MenuItem>
						: ''}
					{userInRole(roles, ['editor', 'admin', 'commenter']) ?
						(
							<div>
								<MenuItem
									to="/commentary/create"
									onClick={closeLeftMenu}
								>
										Add Comment
								</MenuItem>
								<MenuItem
									to="/tags/create"
									onClick={closeLeftMenu}
								>
										Add Tag
								</MenuItem>
								<MenuItem
									to="/textNodes/edit"
									onClick={closeLeftMenu}
								>
									Edit Text
								</MenuItem>

								<Divider />
							</div>
						)
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
						to="/commenters"
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
					{/*
					<MenuItem
						to="/#visualizations"
						onClick={closeLeftMenu}
					>
						Visualizations
					</MenuItem>
					*/}
					<Divider />

					{userId ?
						<div>
							<MenuItem
								to="/profile"
								onClick={closeLeftMenu}
							>
								Profile
							</MenuItem>
							<MenuItem
								to="/"
								onClick={dispatchLogout}
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
	roles: state.auth.roles,
	commenters: state.auth.commenters,
	tenantId: state.tenant.tenantId,
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
