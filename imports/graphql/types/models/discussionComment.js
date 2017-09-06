import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList
} from 'graphql';


const DiscussionCommentType = new GraphQLObjectType({
	name: 'DiscussionCommentType',
	description: 'A discussion comment in the commentary',
	fields: {
		userId: {
			type: GraphQLString,
		},
		content: {
			type: GraphQLString,
		},
		parentId: {
			type: GraphQLString,
		},
		commentId: {
			type: GraphQLString,
		},
		status: {
			type: GraphQLString,
		},
		votes: {
			type: GraphQLInt,
		},
		voters: {
			type: new GraphQLList(GraphQLString),
		},
		reported: {
			type: GraphQLInt,
		},
		usersReported: {
			type: new GraphQLList(GraphQLString),
		},
		tenantId: {
			type: GraphQLString, 
		},
	},
});


export {DiscussionCommentType};
