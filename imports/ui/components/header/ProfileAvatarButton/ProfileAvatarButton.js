import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import UserDropdown from '../UserDropdown';

const ProfileAvatarButton = (props) => {
	const loggedInUser = Meteor.user();
	const showUserDropdown = false;
	const numberOfNotifications = props.notifications ? props.notifications.length : 0;

	return (
		<div
			className="profileButton"
			onMouseOver={props.showUserDropdown}
			onMouseLeave={props.hideUserDropdown}
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
};

ProfileAvatarButton.propTypes = {
	notifications: PropTypes.array,
	showUserDropdown: PropTypes.func,
	hideUserDropdown: PropTypes.func
};

const ProfileAvatarButtonContainer = createContainer(() => {
	let notifications = [];

	if (Meteor.user() && Meteor.user().subscriptions) {
		notifications = Meteor.user().subscriptions.notifications;
	}

	return {
		notifications
	};
}, ProfileAvatarButton);

export default ProfileAvatarButtonContainer;
