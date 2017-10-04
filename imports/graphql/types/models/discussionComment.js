import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLInputObjectType,
} from 'graphql';


const DiscussionCommentType = new GraphQLObjectType({
	name: 'DiscussionCommentType',
	description: 'A discussion comment in the commentary',
	fields: {
		_id: {
			type: GraphQLString,
		},
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
const DiscussionCommentInputType = new GraphQLInputObjectType({
	name: 'DiscussionCommentInputType',
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


export {DiscussionCommentType, DiscussionCommentInputType};
