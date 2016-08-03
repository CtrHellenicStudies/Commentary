/*
 * Replace these in the future as they will publish our entire collections.
 */

if (Meteor.isServer){

  Meteor.publish('comments', function(limit) {
		let query = {};
		if(!limit || isNaN(parseInt(limit))){
			limit = 10;
		}

    return Comments.find(query, {limit: limit, sort: {'work.order': 1, 'subwork.n':1, lineFrom:1, nLines:-1}});
  });

  Meteor.publish('commenters', function() {
    return Commenters.find();
  });

  Meteor.publish('discussion_comments', function() {
    return DiscussionComments.find();
  });

  Meteor.publish('keywords', function() {
    return Keywords.find();
  });

  Meteor.publish('revisions', function() {
    return Revisions.find();
  });

  Meteor.publish('subworks', function() {
    return Subworks.find();
  });

  Meteor.publish('works', function() {
    return Works.find();
  });


}
