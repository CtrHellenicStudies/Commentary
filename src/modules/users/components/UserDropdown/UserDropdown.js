import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// lib
import Utils from '../../../../lib/utils';

// components
import RecentList from '../RecentList';

// auth
import { logoutUser } from '../../../../lib/auth';


class UserDropdown extends Component {

	constructor(props) {
		super(props);

		this.state = {
			authenticated: ~props.user,
		};
	}

	signOut() {
		logoutUser();
		this.setState({
			authenticated: false,
		});
	}

	render() {
		const { user } = this.props;
		let username = user.username;
		let recentItems = [];

		if ('recentPositions' in user) {
			const itemsToRemove = [];
			recentItems = user.recentPositions;

			// remove recent positions with the same link as location.pathname
			recentItems.forEach((recentItem, i) => {
				if (recentItem.link === window.location.pathname) {
					itemsToRemove.push(i);
				}
			});
			itemsToRemove.forEach((itemIndex) => {
				recentItems.splice(itemIndex, 1);
			});

			// only display two most recent items
			if (recentItems.length >= 2) {
				recentItems = recentItems.slice(recentItems.length - 2, recentItems.length);
			}
		}

		if (user.profile && 'name' in user.profile) {
			username = user.profile.name;
		}

		if (!username.length) {
			username = 'Profile';
		}

		return (
			<div className="userDropdown paperShadow">
				<div className="userDropdownLeft">
					<h4>Keep Reading</h4>
					<RecentList recentItems={recentItems} />
				</div>
				<div className="userDropdownRight">
					<a href={`http://profile.${Utils.getEnvDomain()}/profile`}>{Utils.trunc(username, 16)}</a>
					<a href={`http://profile.${Utils.getEnvDomain()}/`}>Community</a>
					<a href={`http://profile.${Utils.getEnvDomain()}/about`}>About</a>
					<a href="mailto:muellner@chs.harvard.edu">Contact</a>
					<a href={`http://profile.${Utils.getEnvDomain()}/terms`}>Terms</a>
					<a
						onClick={this.signOut}
					>
						Sign out
					</a>
				</div>
			</div>
		);
	}
}

UserDropdown.propTypes = {
	user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
	username: state.auth.username,
});

export default connect(mapStateToProps)(UserDropdown);
