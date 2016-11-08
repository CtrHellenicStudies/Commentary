Meteor.publish('user.discussionComments', function (query, skip, limit) {
	if (!query) {
		query = {};
	}

	if (!skip) {
		skip = 0;
	}

	if (!limit) {
		limit = 100;
	}

	if (this.userId) {
		query['user._id'] = this.userId;
		return DiscussionComments.find(query, {skip, limit, sort: {created: -1}});
	} else {
		return [];
	}
});

Meteor.publish('userData', function () {
	return Meteor.users.find({'_id': this.userId});
});
