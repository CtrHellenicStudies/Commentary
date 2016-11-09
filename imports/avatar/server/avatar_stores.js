import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Roles } from 'meteor/alanning:roles';
import gm from 'gm';
import { Avatars } from '../avatar_collections.js';

export function checkAvatarPermissions(userId, avatar) {
	if (!userId)
		return false;

	if (Roles.userIsInRole(userId, ['developer', 'admin']))
		return true;

	if (avatar.contextType === 'user') {
		return userId === avatar.userId;
	} else if (avatar.contextType === 'commenter') {

	} else {
		throw new Error(`Invalid context type ${avatar.contextType}`);
	}
}

const AvatarFilter = new UploadFS.Filter({
	minSize: 1,
	maxSize: 1024 * 1000, // 1 MB
	constentTypes: [ 'image/*' ],
	extensions: [ 'jpg', 'jpeg' , 'png', 'gif' ],
});

const AvatarPermissions = new UploadFS.StorePermissions({
	insert: checkAvatarPermissions,
	remove: checkAvatarPermissions,
	update: checkAvatarPermissions,
});

function transformAvatar(from, to, fileId, file) {
	let p = gm(from);
	p.resize(230, 230)
		.gravity('Center')
		.extent(230, 230)
		.quality(100);
	p.stream().pipe(to);
}

export const AvatarStore = new UploadFS.store.GridFS({
	collection: Avatars,
	name: 'avatars',
	chunkSize: 1024 * 64,
	filter: AvatarFilter,
	permissions: AvatarPermissions,
	transformWrite: transformAvatar
});

function finishUserAvatarUpload(avatar) {
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
		function handleUserAvatarUpdateComplete(avatarUpdateErr) {
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
}

function finishCommenterAvatarUpload(avatar) {
	const c = Commenters.findOne({_id: avatar.commenterId}, { fields: { _id:1, avatar:1 }});
	const oldAvatarId = 'avatar' in c && c.avatar ? c.avatar : null;

	Commenters.update(
		{ _id: avatar.commenterId },
		{
			$set: {
				avatar: avatar._id,
			}
		},
		{ multi: false },
		function handleCommenterAvatarUpdateComplete(avatarUpdateErr) {
			if (avatarUpdateErr) {
				console.error('could not update commenter ', avatar.commenterId, ' with avatar ', avatar._id,
					'; error:', avatarUpdateErr
				);
				AvatarStore.delete(avatar._id);
			} else if (oldAvatarId) {
				AvatarStore.delete(oldAvatarId, (storeDeleteErr) => {
					if (storeDeleteErr) {
						console.error('could not delete avatar ', oldAvatarId, ' for commenter ', avatar.commenterId,
							'; error:', storeDeleteErr
						);
					}
				});
			}
		}
	);
}

AvatarStore.onFinishUpload = function handleAvatarFinishUpdate(avatar) {
	if (avatar.contextType === 'user')
		finishUserAvatarUpload(avatar);
	else if (avatar.contextType === 'commenter')
		finishCommenterAvatarUpload(avatar);
};

AvatarStore.onCopyError = (err, avatarId, avatar) => {
	console.log('Avatar copy error. avatar:', avatar, ' error:', err);
};

AvatarStore.nReadError = (err, avatarId, avatar) => {
	console.log('Avatar read error. avatar:', avatar, ' error', err);
};

AvatarStore.onWriteError = (err, avatarId, avatar) => {
	console.log('Avatar write error. avatar:', avatar, ' error', err);
};
