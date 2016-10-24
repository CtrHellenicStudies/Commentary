import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { Avatars } from './avatar_collections.js';

function deleteUserAvatar(userId, avatar) {
	if (userId == avatar.userId || Roles.userIsInRole(userId, ['developer', 'admin'])) {
		Meteor.users.update(
			{ _id: userId, 'avatar._id': avatar._id },
			{ $unset:{ avatar:1 } }
		);
		return Avatars.remove({ _id:avatar._id });
	} else {
		throw new Meteor.Error('403', 'Access denied');
	}
}

function deleteCommenterAvatar(userId, avatar) {
	if (Roles.userIsInRole(userId, ['developer', 'admin'])) {
		const nUpdated = Commenters.update(
			{ _id:avatar.commenterId },
			{ $unset: { avatar:1 }}
		);

		console.log("nUpdated=", nUpdated);
		return Avatars.remove({ _id:avatar._id });
	} else {
		throw new Meteor.Error('403', 'Access denied');
	}
}

export const deleteAvatar = new ValidatedMethod({
	name: 'avatar.delete',

	validate: new SimpleSchema({
		avatarId: { type: String }
	}).validator(),

	run({ avatarId }) {
		if (!this.userId) {
			throw new Meteor.Error('403', 'Access denied');
		}

		let avatar = Avatars.findOne({ _id:avatarId });
		if (!avatar) {
			throw new Meteor.Error('not-found', `Avatar ${avatarId} not found.`);
		}

		if (avatar.contextType === 'user') {
			return deleteUserAvatar(this.userId, avatar);
		} else if (avatar.contextType === 'commenter') {
			return deleteCommenterAvatar(this.userId, avatar);
		} else {
			throw new Meteor.Error('invalid-type', `Unknow avatar type ${avatar.contextType}.`);
		}
	}
});