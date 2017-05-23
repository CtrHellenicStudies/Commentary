import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

class CommunityMemberTeaser extends React.Component {
	static propTypes = {
		user: React.PropTypes.object,
	}

	render() {
		const { user } = this.props;
		const userUrl = `/users/${user._id}/${user.username}`;
		let userExcerpt = '';
		let profilePicture = '';
		let username = user.username;

		if (user.profile) {
			userExcerpt = user.profile.biography ? Utils.trunc(user.profile.biography, 120) : '';
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
				<a href={userUrl}>
					<div className="user-image paper-shadow">
						<AvatarIcon avatar={profilePicture} />
					</div>
				</a>
				<div className="user-teaser-text">
					<a href={userUrl}>
						<h4>{username}</h4>
					</a>
				</div>
			</div>
		);
	}
}

export default CommunityMemberTeaser;
