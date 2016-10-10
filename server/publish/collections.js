/*
 * Replace these in the future as they will publish our entire collections.
 */

if (Meteor.isServer){

	Meteor.publish('comments', function(query, skip, limit) {
		if(!skip){
			skip = 0;
		}

		if(!limit || limit !=0){
			limit = 10;
		}

		return Comments.find(query, {skip: skip, limit: limit, sort: {'work.order': 1, 'subwork.n':1, lineFrom:1, nLines:-1}});

	});

	Meteor.publish('textNodes', function(textQuery) {
		var query = textQuery || {};

		return TextNodes.find(query, {limit:100, sort:{"text.n":1}});

	});

	Meteor.publish('commenters', function() {
		return Commenters.find({}, {sort:{name: 1}});
	});

	Meteor.publish('discussionComments', function() {
		return DiscussionComments.find();
	});

	Meteor.publish('keywords', function() {
		return Keywords.find({},{sort:{title:1}});
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

	Meteor.publish('profilePictures', function() {
		return ProfilePictures.find();
	});

	Meteor.publish('referenceWorks', function() {
		return ReferenceWorks.find();
	});


}
