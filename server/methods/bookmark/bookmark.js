import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

function bookmarkInsert(textNodeId) {
	// Make sure the user is logged in before inserting
	check(textNodeId, String);
	if (!Meteor.userId()) {
		throw new Meteor.Error('not-authorized');
	}
	try {
		return Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $push: { bookmarks: textNodeId } }
		);
	} catch (err) {
		throw new Meteor.Error('user update failed', err);
	}
}

function bookmarkRemove(textNodeId) {
	// Make sure the user is logged in before removing
	check(textNodeId, String);
	if (!Meteor.userId()) {
		throw new Meteor.Error('not-authorized');
	}
	try {
		return Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: { bookmarks: textNodeId } }
		);
	} catch (err) {
		throw new Meteor.Error('user update failed', err);
	}
}


Meteor.methods({
	'bookmark.insert': bookmarkInsert,
	'bookmark.remove': bookmarkRemove,
});

export { bookmarkInsert, bookmarkRemove };
