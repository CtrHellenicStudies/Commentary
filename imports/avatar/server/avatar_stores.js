import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Avatars } from '../avatar_collections.js';

// TODO: avatar permissions
const AvatarPermissions = new UploadFS.StorePermissions({
	insert: (userId, avatar) => {
		// console.log('AvatarPermissions.insert userId:', userId, ' avatar:', avatar);
	},
	remove: (userId, avatar) => {
		// console.log('AvatarPermissions.remove userId:', userId, ' avatar:', avatar);
	},
	update: (userId, avatar) => {
		// console.log('AvatarPermissions.update userId:', userId, ' avatar:', avatar);
	},
});

const AvatarFilter = new UploadFS.Filter({
	minSize: 1,
	maxSize: 1024 * 1000, // 1 MB
	constentTypes: [ 'image/*' ],
});

export const AvatarStore = new UploadFS.store.Local({
	collection: Avatars,
	name: 'avatars',
	path: './var/avatars',
	filter: AvatarFilter,
	permissions: AvatarPermissions,
});

AvatarStore.onFinishUpload = function handleAvatarFinishUpdate(avatar) {
	const userId = Meteor.userId();
	const user = Meteor.user();

	if ('avatar' in user && '_id' in user.avatar) {
		AvatarStore.delete(user.avatar._id, (error) => {
			if (error) {
				console.error('could not delete avatar ', user.avatar, ' for user ', userId, 
					'; error:', error
				);
			}
		});
	}

	Meteor.users.update(
		{ _id: userId }, 
		{
			$set: {
				avatar: {
					_id: avatar._id,
					type: avatar.type,
					url: avatar.url,
				},
			},
		},
		{ multi: false, },
		error => {
			if (error) {
				console.error('could not update user ', userId, ' with avatar ', avatar._id, 
					'; error:', error
				);
			}
		}
	);
};

// TODO:
AvatarStore.onCopyError = (err, avatarId, avatar) => {
};

AvatarStore.nReadError = (err, avatarId, avatar) => {
};

AvatarStore.onWriteError = (err, avatarId, avatar) => {
};
