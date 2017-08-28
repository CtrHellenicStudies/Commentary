import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';

// models
import Comments from '/imports/models/comments';

// errors
import { AuthenticationError } from '/imports/errors';

const commentMutationFileds = {
	commentCreate: {
		type: CommentType,
		description: 'Create new comment',
		args: {
			title: {
				type: new GraphQLNonNull(GraphQLString),
			},
			content: {
				type: new GraphQLNonNull(GraphQLString),
			},
			commenter: {
				type: new GraphQLNonNull(GraphQLString),
			},
		},
		resolve(parent, { title, content }, { user, tenant }) {

			// only a logged in user and coming from the admin page, can create new project
			if (user && tenant.adminPage) {
				return Comments.insert({
					tenantId: tenant._id,
					title,
					description,
				});
			}

			throw AuthenticationError();
		}
	}
};

export default commentMutationFileds;
