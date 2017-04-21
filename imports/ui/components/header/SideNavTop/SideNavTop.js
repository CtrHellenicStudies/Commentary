// components:
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';

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
