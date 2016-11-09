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
