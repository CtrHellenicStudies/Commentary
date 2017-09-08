import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommenterType from '/imports/graphql/types/models/commenter';
import { RemoveType } from '/imports/graphql/types/index';

// bll
import CommentersService from '../bll/commenters';

const commenterMutationFields = {

	commenterRemove: {
		type: RemoveType,
		description: 'Remove a single commenter',
		args: {
			commenterId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {commenterId}, {token}) {
			const commentersService = new CommentersService({token});
			return await commentersService.commenterRemove(commenterId);
		}
	}
};

export default commenterMutationFields;
