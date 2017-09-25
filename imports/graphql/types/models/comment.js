import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';


const CommentInputType = new GraphQLInputObjectType({
	name: 'CommentInputType',
	description: 'A comment in the commentary',
	fields: {
		_id: {
			type: GraphQLString,
		},
		urn: {
			type: GraphQLString,
		},
		originalDate: {
			type: GraphQLDate,
		},
		status: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		commenters: {
			type: new GraphQLList(GraphQLJSON),
		},
		users: {
			type: new GraphQLList(GraphQLString),
		},
		work: {
			type: GraphQLJSON
		},
		subwork: {
			type: GraphQLJSON
		},
		lineFrom: {
			type: GraphQLInt,
		},
		lineTo: {
			type: GraphQLInt,
		},
		lineLetter: {
			type: GraphQLString,
		},
		bookChapterUrl: {
			type: GraphQLString,
		},
		paragraphN: {
			type: GraphQLInt,
		},
		nLines: {
			type: GraphQLInt,
		},
		commentOrder: {
			type: GraphQLInt,
		},
		parentCommentId: {
			type: GraphQLString,
		},
		referenceId: {
			type: GraphQLString,
		},
		referenceWorks: {
			type: new GraphQLList(GraphQLJSON),
		},
		keywords: {
			type: new GraphQLList(GraphQLJSON),
		},
		revisions: {
			type: new GraphQLList(GraphQLJSON),
		},
		discussionComments: {
			type: new GraphQLList(GraphQLJSON),
		},
		isAnnotation: {
			type: GraphQLBoolean,
		},
		discussionCommentsDisabled: {
			type: GraphQLBoolean,
		},
		created: {
			type: GraphQLDate,
		},
		updated: {
			type: GraphQLDate,
		},
	},
});

const CommentType = new GraphQLObjectType({
	name: 'CommentType',
	description: 'A comment in the commentary',
	fields: {
		_id: {
			type: GraphQLString,
		},
		urn: {
			type: GraphQLString,
		},
		originalDate: {
			type: GraphQLDate,
		},
		status: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		commenters: {
			type: new GraphQLList(GraphQLJSON),
		},
		users: {
			type: new GraphQLList(GraphQLString),
		},
		work: {
			type: GraphQLJSON
		},
		subwork: {
			type: GraphQLJSON
		},
		lineFrom: {
			type: GraphQLInt,
		},
		lineTo: {
			type: GraphQLInt,
		},
		lineLetter: {
			type: GraphQLString,
		},
		bookChapterUrl: {
			type: GraphQLString,
		},
		paragraphN: {
			type: GraphQLInt,
		},
		nLines: {
			type: GraphQLInt,
		},
		commentOrder: {
			type: GraphQLInt,
		},
		parentCommentId: {
			type: GraphQLString,
		},
		referenceId: {
			type: GraphQLString,
		},
		referenceWorks: {
			type: new GraphQLList(GraphQLJSON),
		},
		keywords: {
			type: new GraphQLList(GraphQLJSON),
		},
		revisions: {
			type: new GraphQLList(GraphQLJSON),
		},
		discussionComments: {
			type: new GraphQLList(GraphQLJSON),
		},
		isAnnotation: {
			type: GraphQLBoolean,
		},
		discussionCommentsDisabled: {
			type: GraphQLBoolean,
		},
		created: {
			type: GraphQLDate,
		},
		updated: {
			type: GraphQLDate,
		},
	},
});

export { CommentInputType };
export default CommentType;
