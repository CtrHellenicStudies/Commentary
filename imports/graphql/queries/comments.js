import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import slugify from 'slugify';

// types
import CommentType from '/imports/graphql/types/models/comment';

// models
import Comments from '/imports/models/comments';


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
		resolve(parent, { tenantId, limit, skip, workSlug, subworkN, }, context) {
			const args = {};

			const options = {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
			};
			if ('work' in args) {
				args['work.slug'] = slugify(workSlug);
			}
			if ('subwork' in args) {
				args['subwork.n'] = subworkN;
			}

			if (tenantId) {
				args.tenantId = tenantId;
			}

			if (skip) {
				options.skip = skip;
			} else {
				options.skip = 0;
			}

			if (limit) {
				if (limit > 100) {
					options.limit = 100;
				}
				options.limit = limit;
			} else {
				options.limit = 30;
			}

			return Comments.find(args, options).fetch();
		}
	},
};

export default commentQueryFields;
