import React from 'react';

import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import UserDropdown from '../UserDropdown';

const ProfileAvatarButton = props => {
	const loggedInUser = Meteor.user();
	const showUserDropdown = false;

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


export default ProfileAvatarButton;
