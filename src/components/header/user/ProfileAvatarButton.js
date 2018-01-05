import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import AvatarIcon from '../../../modules/profile/avatar/AvatarIcon';
import UserDropdown from './UserDropdown';

class ProfileAvatarButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(props) {
		let notifications = [];
		const user = Cookies.getItem('user');
		if (user && user.subscriptions) {
			notifications = user.subscriptions.notifications;
		}
		this.setState({
			notifications: notifications
		});
	}
	render() {
		const loggedInUser = Cookies.getItem('user');
		const showUserDropdown = false;
		const numberOfNotifications = this.state.notifications ? this.state.notifications.length : 0;

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
							avatar={'profile' in loggedInUser ? loggedInUser.profile.avatarUrl : ''}
						/>
					</a>
				</div>
				{showUserDropdown ?
					<UserDropdown
						user={loggedInUser}
					/>
				: ''}
			</div>
		);
	}
}
ProfileAvatarButton.propTypes = {
	showUserDropdown: PropTypes.func,
	hideUserDropdown: PropTypes.func
};
export default ProfileAvatarButton;
