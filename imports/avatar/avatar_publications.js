import { Meteor } from 'meteor/meteor';

const PublicAvatarFields = {
	name:1,
	size:1,
	type:1,
	userId:1,
	url:1,
};
const PublicUserAvatarFields = {
	'avatar.name': 1,
	'avatar.size': 1,
	'avatar.type': 1,
	'avatar.url': 1,
};

Meteor.publish('users.myAvatar', function() {
	if (this.userId) {
		return Meteor.users.find(
			{ _id:this.userId },
			PublicUserAvatarFields,
		);
	} else {
		this.ready();
	}
});

// TODO: publish list of avatars (other than logged in user)
