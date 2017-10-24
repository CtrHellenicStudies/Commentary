/**
 * User publications from Meteor
 */

// models
import DiscussionComments from '/imports/models/discussionComments';
import TextNodes from '/imports/models/textNodes';
import Books from '/imports/models/books';
import Comments from '/imports/models/comments';
import Tenants from '/imports/models/tenants';

/**
 * Get all discussion comments for a user
 * @param {string} userId - id of user
 * @param {string} sortMethod - method to sort the discussion comments
 * @returns {Object[]} Cursor of discussion comments
 */
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

/**
 * Get all textNodes bookmarked by a user
 * @param {string} userId - id of user
 * @returns {Object[]} Cursor of textNodes
 */
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

/**
 * Get all comment annotations created by a user
 * @param {string} userId - id of user
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('user.annotations', (userId) => {
	check(userId, String);

	return Comments.find({
		userId: userId,
	});
});

/**
 * Get the user record for the currently authenticated user
 * @returns {Object[]} Cursor of users
 */
Meteor.publish('userData', function userData() {
	return Meteor.users.find({ _id: this.userId });
});

/**
 * Get the user record for the supplied user Id
 * @param {string} userId - id of user
 * @returns {Object[]} Cursor of users
 */
Meteor.publish('users.id', (userId) => {
	check(userId, String);
	return Meteor.users.find({
		_id: userId,
	});
});

/**
 * Gets all users in the commentaries
 * @returns {Object[]} Cursor of users
 */
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
			subscriptions: 1,
			roles: 1,
			highlightingPreference: 1,
			canAnnotateBooks: 1,
			authorOfBooks: 1,
			canEditCommenters: 1,
			recentPositions: 1,
		},
		sort: {
			'profile.name': 1,
			'emails.address': 1,
		},
		skip,
		limit,
	});
});

/**
 * Gets a user referenced by a user id and auth token
 * @param {string} userId - id of user
 * @param {string} token - authentication token for user
 * @returns {Object[]} Cursor of users
 */
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
			subscriptions: 1,
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

/**
 * Gets a user referenced by a user id and auth token with admin role
 * @param {string} userId - id of user
 * @param {string} token - authentication token for user
 * @returns {Object[]} Cursor of users
 */
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
