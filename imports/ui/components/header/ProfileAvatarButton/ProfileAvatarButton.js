import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import UserDropdown from '../UserDropdown';

class ProfileAvatarButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(props) {
		let notifications = [];
		
		if (Meteor.user() && Meteor.user().subscriptions) {
			notifications = Meteor.user().subscriptions.notifications;
		}
		this.setState({
			notifications: notifications
		});
	}
	render() {
		const loggedInUser = Meteor.user();
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
