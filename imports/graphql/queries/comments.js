import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';

// bll
import CommentService from '../bll/comments';

const commentQueryFields = {
	comments: {
		type: new GraphQLList(CommentType),
		description: 'Get list of all comments',
		args: {
			tenantId: {
				type: GraphQLID,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
			workSlug: {
				type: GraphQLString,
			},
			subworkN: {
				type: GraphQLInt,
			},
			lineFrom: {
				type: GraphQLInt,
			},
			lineTo: {
				type: GraphQLInt,
			},
		},
		async resolve(parent, { tenantId, limit, skip, workSlug, subworkN }, {token}) {
			const commentService = new CommentService({token});
			return await commentService.commentsGet(tenantId, limit, skip, workSlug, subworkN);
		}
	},
};

export default commentQueryFields;
