Meteor.methods({
  'discussionComments.insert'(discussionComment) {
    // Make sure the user is logged in before inserting
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

		var currentUser = Meteor.users.findOne({_id: this.userId});


		discussionComment.user = currentUser;
		discussionComment.votes = 1;
		discussionComment.voters = [currentUser._id];

    //check(discussionComment.user, Schemas.User);
    check(discussionComment.content, String);
    check(discussionComment.votes, Number);
    check(discussionComment.commentId, String);

		console.log("Inserting new comment", discussionComment);
    try {
      DiscussionComments.insert(discussionComment);
    }

    catch(err){
      console.log(err);
    }

  },

  'discussionComments.update'(discussionCommentId, discussionCommentData) {
    // Make sure the user is logged in before inserting
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

		var currentUser = Meteor.users.findOne({_id: this.userId});


		discussionComment.user = currentUser;
		discussionComment.votes = 1;
		discussionComment.voters = [currentUser._id];

    //check(discussionComment.user, Schemas.User);
    check(discussionComment.content, String);
    check(discussionComment.votes, Number);
    check(discussionComment.commentId, String);

		console.log("Inserting new comment", discussionComment);
    try {
      DiscussionComments.insert(discussionComment);
    }

    catch(err){
      console.log(err);
    }
  },

  'discussionComments.upvote'(discussionCommentId, discussionCommentData) {
    // Make sure the user is permitted to update
    var discussionComment = DiscussionComment.findOne(discussionCommentId);

    if (this.userId != discussionComment.user) {
      throw new Meteor.Error('not-authorized');
    }

    check(discussionComment.user, String);
    check(discussionComment.content, String);
    check(discussionComment.votes, Number);

    try {
      DiscussionComments.update(discussionCommentId, { $set: discussionCommentData });
    }

    catch(err){
      console.log(err);
    }

  },

});
