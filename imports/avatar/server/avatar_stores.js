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
	const user = Meteor.user();
	const oldAvatarId = 'avatar' in user && '_id' in user.avatar ? user.avatar._id : null; 
	
	Meteor.users.update(
		{ _id: user._id }, 
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
		function handleAvatarUpdateComplete(avatarUpdateErr) {
			if (avatarUpdateErr) {
				console.error('could not update user ', user._id, ' with avatar ', avatar._id, 
					'; error:', avatarUpdateErr
				);
				AvatarStore.delete(avatar._id);
			} else if (oldAvatarId) {
				AvatarStore.delete(oldAvatarId, (storeDeleteErr) => {
					if (storeDeleteErr) {
						console.error('could not delete avatar ', user.avatar, ' for user ', user._id, 
							'; error:', storeDeleteErr
						);
					}
				});
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
