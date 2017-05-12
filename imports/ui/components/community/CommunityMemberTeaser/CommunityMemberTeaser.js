import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class CommunityMemberTeaser extends React.Component {
	static propTypes = {
		user: React.PropTypes.object,
	}

	render() {
		const { user } = this.props;
		const userUrl = `/users/${user.username}`;
		const userExcerpt = user.profile.biography ? Utils.trunc(user.profile.biography, 120) : '';



		return (
			<div className="communityMemberTeaser hvr-grow wow fadeIn">
				<a href={userUrl}>
					<div className="user-image paper-shadow">
						{user && user.avatar ?
							<AvatarIcon avatar={user.avatar.src} />
						:
							<img
								src={user && user.avatar ? user.avatar : '/images/default_user.jpg'}
								alt={user.name}
							/>
						}
					</div>
				</a>
				<div className="user-teaser-text">
					<a href={userUrl}>
						<h3>{user.name}</h3>
					</a>
					<hr />
					<p className="user-description">
						{userExcerpt}
					</p>
				</div>
			</div>
		);
	}
}

export default CommunityMemberTeaser;
