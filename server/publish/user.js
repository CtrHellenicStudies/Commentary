Meteor.publishComposite('user', function() {
	return {
		find: function() {
			return Meteor.users.find({
				_id: this.userId
			});
		},
		children: [
			{
				find: function(user) {
					var _id, ref;
					_id = ((ref = user.profile) != null ? ref.picture : void 0) || null;
					return ProfilePictures.find({
						_id: _id
					});
				}
			}
		]
	};
});

Meteor.publish('user.discussionComments', function(query, skip, limit) {
	if(!query){
		query = {};
	}

	if(!skip){
		skip = 0;
	}

	if(!limit){
		limit = 100;
	}

	console.log(this.userId);
	if (this.userId) {
		query["user._id"] = this.userId;
		return DiscussionComments.find(query, {skip: skip, limit: limit, sort: {created: -1}});
	}else {
		return [];
	}
});

Meteor.publish('userData', function() {
	return Meteor.users.find({'_id': this.userId});
});
