import DiscussionComments from '/imports/collections/discussionComments';

Meteor.publish('user.discussionComments', function discussionComments(query, skip, limit) {
	check(query, Object);
	check(skip, Number);
	check(limit, Number);
	const newQuery = query;
	if (this.userId) {
		newQuery['user._id'] = this.userId;
		return DiscussionComments.find(newQuery, { skip, limit, sort: { created: -1 } });
	}
	return [];
});

Meteor.publish('userData', function userData() {
	return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('allUsers', (userId) => {
	check(userId, String);
	return Meteor.users.find({
		_id: userId,
	}, {
		fields: {
			username: 1,
			avatar: 1,
			profile: 1,
		},
	});
});

Meteor.publish('users.all', () => {
	const userId = Meteor.userId;

	return Meteor.users.find({}, {
		fields: {
			username: 1,
			emails: 1,
			profile: 1,
			services: 1,
			roles: 1,
			highlightingPreference: 1,
		},
		sort: {
			username: 1,
			'emails.address': 1,
		},
	});
});
