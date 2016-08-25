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
	if(!skip){
		skip = 0;
	}

	if(!limit){
		limit = 1000;
	}

	if(Meteor.userId && query){
		query["user._id"] = Meteor.userId;
	  return DiscussionComments.find(query, {skip: skip, limit: limit, sort: {created: -1}});
	}else {
		return [];
	}


});
