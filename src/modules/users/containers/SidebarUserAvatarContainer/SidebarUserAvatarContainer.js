import React from 'react';
import { compose } from 'react-apollo';


import userAvatarQuery from '../../graphql/queries/avatar';
import SidebarUserAvatar from '../../components/SidebarUserAvatar';


const SidebarUserAvatarContainer = (props) => {
	let user;
	let userName = '';
	let avatarUrl = '/images/default_user.jpg';

	if (props.userAvatarQuery && props.userAvatarQuery.userProfile) {
		user = props.userAvatarQuery.userProfile;
		userName = user.username;

		if (user.profile) {
			if ('avatarUrl' in user.profile && user.profile.avatarUrl) {
				avatarUrl = user.profile.avatarUrl;
			}
			if ('name' in user.profile) {
				userName = user.profile.name;
			}
		}
	}
	console.log('#####')
	console.log('#####')
	console.log('#####')
	console.log('#####')
	console.log(props);
	console.log(user);

	return (
		<SidebarUserAvatar
			avatarUrl={avatarUrl}
			name={userName}
		/>
	);
};

export default compose(
	userAvatarQuery,
)(SidebarUserAvatarContainer);
