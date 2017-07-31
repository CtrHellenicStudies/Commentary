import DiscussionComments from '/imports/api/collections/discussionComments';
import TextNodes from '/imports/api/collections/textNodes';
import Books from '/imports/api/collections/books';
import Comments from '/imports/api/collections/comments';
import Tenants from '/imports/api/collections/tenants';

Meteor.publish('user.discussionComments', (userId, sortMethod = 'votes') => {
	check(userId, String);
	check(sortMethod, String);

	let sort = { votes: -1, updated: -1 };

	if (sortMethod === 'recent') {
		sort = {
			updated: -1,
			votes: -1,
		};
	}

	return DiscussionComments.find({
		userId: userId,
	}, {
		sort,
	});
});

Meteor.publish('user.bookmarks', (userId) => {
	check(userId, String);

	const user = Meteor.users.find({ _id: userId });

	if (!user.bookmarks) {
		return [];
	}

	return TextNodes.find({
		_id: user.bookmarks,
	});
});

Meteor.publish('user.annotations', (userId) => {
	check(userId, String);

	return Comments.find({
		userId: userId,
	});
});

Meteor.publish('userData', function userData() {
	return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('users.id', (userId) => {
	check(userId, String);
	return Meteor.users.find({
		_id: userId,
	});
});

Meteor.publish('users.all', () => {
	// query all users;
	const skip = 0;
	const limit = 1000;

	return Meteor.users.find({}, {
		fields: {
			username: 1,
			emails: 1,
			profile: 1,
			services: 1,
			roles: 1,
			highlightingPreference: 1,
			canAnnotateBooks: 1,
			authorOfBooks: 1,
			canEditCommenters: 1,
			recentPositions: 1,
		},
		sort: {
			username: 1,
			'emails.address': 1,
		},
		skip,
		limit,
	});
});

Meteor.publish('users.token', (userId, token) => {
	check(userId, String);
	check(token, String);

	return Meteor.users.find({
		_id: userId,
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	}, {
		fields: {
			username: 1,
			emails: 1,
			profile: 1,
			services: 1,
			roles: 1,
			highlightingPreference: 1,
			canAnnotateBooks: 1,
			authorOfBooks: 1,
			canEditCommenters: 1,
			recentPositions: 1,
		},
		sort: {
			username: 1,
			'emails.address': 1,
		},
	});
});

Meteor.publish('users.token.admin', (userId, token) => {
	check(userId, String);
	check(token, String);

	return Meteor.users.find({
		_id: userId,
		roles: 'admin',
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	}, {
		fields: {
			username: 1,
			emails: 1,
			profile: 1,
			services: 1,
			roles: 1,
			highlightingPreference: 1,
			canAnnotateBooks: 1,
			authorOfBooks: 1,
			canEditCommenters: 1,
			recentPositions: 1,
		},
		sort: {
			username: 1,
			'emails.address': 1,
		},
	});
});
