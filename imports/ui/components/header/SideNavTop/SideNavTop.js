import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

// components:
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

const SideNavTop = ({ currentUser, username }) => (
	<div className="sidenav-top">
		{Meteor.user() &&
			<a href="/profile">
				<div className="user-image paper-shadow">
					<AvatarIcon avatar={currentUser && currentUser.profile ? currentUser.profile.avatarUrl : '/images/default_user.jpg'} />
				</div>
			</a>}
		<a href="/profile">
			<span className="user-fullname">
				{username}
			</span>
		</a>
	</div>
);
SideNavTop.propTypes = {
	currentUser: PropTypes.shape({
		profile: PropTypes.shape({
			avatarUrl: PropTypes.string,
		}),
	}),
	username: PropTypes.string,
};
SideNavTop.defaultProps = {
	currentUser: null,
	username: null,
};

export default SideNavTop;
