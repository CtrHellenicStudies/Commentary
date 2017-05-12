import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class CommunityMemberTeaser extends React.Component {
	static propTypes = {
		user: React.PropTypes.object,
	}

	render() {
		const { user } = this.props;
		const commenterUrl = `/commenters/${commenter.slug}`;
		const commenterExcerpt = commenter.tagline ? Utils.trunc(commenter.tagline, 120) : '';



		return (
			<div className="communityMemberTeaser hvr-grow wow fadeIn">
				<a href={commenterUrl}>
					<div className="commenter-image paper-shadow">
						{commenter && commenter.avatar ?
							<AvatarIcon avatar={commenter.avatar.src} />
						:
							<img
								src={commenter && commenter.avatar ? commenter.avatar : '/images/default_user.jpg'}
								alt={commenter.name}
							/>
						}
					</div>
				</a>
				<div className="commenter-teaser-text">
					<a href={commenterUrl}>
						<h3>{commenter.name}</h3>
					</a>
					<hr />
					<p className="commenter-description">
						{commenterExcerpt}
					</p>

				</div>
			</div>
		);
	}
}

export default CommunityMemberTeaser;
