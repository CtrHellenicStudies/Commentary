import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

// components:
import AvatarIcon from '../../../modules/profile/avatar/AvatarIcon';

const SideNavTop = ({ currentUser, username }) => (
	<div className="sidenav-top">
		{Cookies.getItem('user') &&
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
