import { GraphQLObjectType } from 'graphql';
import { Meteor } from 'meteor/meteor';

// types
import commentType from '/imports/types/models/comments';

// models
import Comments from '/imports/models/comments';


/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootSubscription = new GraphQLObjectType({
	name: 'RootSubscriptionType',
	description: 'Root Subscription object type',
	fields: {
		commentsNew: {
			type: commentsType,
			description: 'Informs about new comments',
			subscribe: () => Comments.find({}, { sort: { updated: 1 }}),
		}
	},
});

export default RootSubscription;
