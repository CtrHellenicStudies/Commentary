import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import { CommenterType, CommenterInputType } from '/imports/graphql/types/models/commenter';
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
	},
	commenterUpdate: {
		type: CommenterType,
		description: 'Update a commenter',
		args: {
			commenterId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			commenter: {
				type: CommenterInputType
			}
		},
		async resolve(parent, {commenterId, commenter}, {token}) {
			const commentersService = new CommentersService({token});
			return await commentersService.commenterUpdate(commenterId, commenter);
		}
	},
	commenterCreate: {
		type: CommenterType,
		description: 'Create a commenter',
		args: {
			commenter: {
				type: CommenterInputType
			}
		},
		async resolve(parent, {commenter}, {token}) {
			const commentersService = new CommentersService({token});
			return await commentersService.commenterCreate(commenter);
		}
	}
};

export default commenterMutationFields;
