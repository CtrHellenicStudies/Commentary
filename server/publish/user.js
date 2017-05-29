import DiscussionComments from '/imports/api/collections/discussionComments';

Meteor.publish('user.discussionComments', (userId, tenantId, sortMethod = 'votes') => {
	check(userId, String);
	check(tenantId, String);
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
		tenantId,
	}, {
		sort,
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
			canEditCommenters: 1,
			recentPositions: 1,
		},
		sort: {
			username: 1,
			'emails.address': 1,
		},
	});
});
