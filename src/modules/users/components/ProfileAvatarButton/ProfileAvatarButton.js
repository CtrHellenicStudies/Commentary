import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import AvatarIcon from '../../../users/components/AvatarIcon';
import UserDropdown from '../UserDropdown';


import './ProfileAvatarButton.css';


class ProfileAvatarButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(props) {
		let notifications = [];
		const user = Cookies.get('user');
		if (user && user.subscriptions) {
			notifications = user.subscriptions.notifications;
		}
		this.setState({
			notifications: notifications
		});
	}
	render() {
		const showUserDropdown = false;
		const numberOfNotifications = this.state.notifications ? this.state.notifications.length : 0;
		const profile = null;

		return (
			<div
				className="profileButton"
				onMouseOver={this.props.showUserDropdown}
				onMouseLeave={this.props.hideUserDropdown}
			>
				<div
					className="profileButtonAvatar"
				>
					<a
						href="/profile"
					>
						{numberOfNotifications > 0 ?
							<span className="profileButtonHeader profileButtonNotificationBadge notificationBadge">
								{numberOfNotifications}
							</span>
							:
							''
						}
						<AvatarIcon
							className="avatarIcon"
							avatar={profile ? profile.avatarUrl : ''}
						/>
					</a>
				</div>
				{showUserDropdown ?
					<UserDropdown />
					: ''}
			</div>
		);
	}
}

ProfileAvatarButton.propTypes = {
	showUserDropdown: PropTypes.func,
	hideUserDropdown: PropTypes.func
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
	username: state.auth.username,
});

export default connect(mapStateToProps)(ProfileAvatarButton);
