import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AvatarIcon from '../../../profile/components/AvatarIcon';

import './CommunityMemberTeaser.css';


class CommunityMemberTeaser extends React.Component {

	render() {
		const { user } = this.props;
		let profilePicture = '';
		let username = user.username || '';
		const userUrl = `/users/${user._id}/${user.username || ''}`;

		if (user.profile) {
			if ('name' in user.profile) {
				username = user.profile.name;
			}
			if ('picture' in user.profile) {
				profilePicture = user.profile.picture;
			}
			if ('avatarUrl' in user.profile) {
				profilePicture = user.profile.avatarUrl;
			}
		}

		if (!username) {
			return null;
		}


		return (
			<div className="communityMemberTeaser hvr-grow wow fadeIn">
				<Link to={userUrl}>
					<div className="user-image paper-shadow">
						<AvatarIcon avatar={profilePicture} />
					</div>
				</Link>
				<div className="user-teaser-text">
					<Link to={userUrl}>
						<h4>{username}</h4>
					</Link>
				</div>
			</div>
		);
	}
}
CommunityMemberTeaser.propTypes = {
	user: PropTypes.object,
};

export default CommunityMemberTeaser;
