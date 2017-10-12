import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

// components:
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon'; 

const SideNavTop = ({ currentUser, username }) => (
	<div className="sidenav-top">
		{Meteor.user() &&
			<Link to="/profile">
				<div className="user-image paper-shadow">
					<AvatarIcon avatar={currentUser && currentUser.profile ? currentUser.profile.avatarUrl : '/images/default_user.jpg'} />
				</div>
			</Link>}
		<Link to="/profile">
			<span className="user-fullname">
				{username}
			</span>
		</Link>
	</div>
);
SideNavTop.propTypes = {
	currentUser: React.PropTypes.shape({
		profile: React.PropTypes.shape({
			avatarUrl: React.PropTypes.string,
		}),
	}),
	username: React.PropTypes.string,
};
SideNavTop.defaultProps = {
	currentUser: null,
	username: null,
};

export default SideNavTop;
