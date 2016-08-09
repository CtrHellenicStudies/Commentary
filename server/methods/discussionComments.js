Meteor.methods({
  'discussionComments.insert'(discussionComment) {

    // Make sure the user is logged in before inserting
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(discussionComment.user, String);
    check(discussionComment.textNodes, [String]);
    check(discussionComment.isPrivate, Boolean);
    check(discussionComment.content, String);

    try {
      DiscussionComment.insert(discussionComment);
    }

    catch(err){
      console.log(err);
    }

  },

  'discussionComments.remove'(discussionCommentId) {
    // Make sure the user is permitted to remove
    var discussionComment = DiscussionComment.findOne(discussionCommentId);

    if (this.userId != discussionComment.user) {
      throw new Meteor.Error('not-authorized');
    }

    check(discussionCommentId, String);
    try {
      DiscussionComment.remove(discussionCommentId);
    }

    catch(err){
      console.log(err);
    }

  },

  'discussionComments.update'(discussionCommentId, discussionCommentData) {
    // Make sure the user is permitted to update
    var discussionComment = DiscussionComment.findOne(discussionCommentId);

    if (this.userId != discussionComment.user) {
      throw new Meteor.Error('not-authorized');
    }

    check(discussionCommentId, String);
    check(discussionCommentData.isPrivate, Boolean);
    check(discussionCommentData.content, String);

    try {
      DiscussionComment.update(discussionCommentId, { $set: discussionCommentData });
    }

    catch(err){
      console.log(err);
    }

  },

});
