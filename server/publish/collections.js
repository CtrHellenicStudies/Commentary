/*
 * Replace these in the future as they will publish our entire collections.
 */

if (Meteor.isServer){

  Meteor.publish('comments', function(query, skip, limit) {
		if(!skip){
			skip = 0;
		}

		if(!limit){
			limit = 10;
		}
		console.log(skip, limit);

    return Comments.find(query, {skip: skip, limit: limit, sort: {'work.order': 1, 'subwork.n':1, lineFrom:1, nLines:-1}});
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
