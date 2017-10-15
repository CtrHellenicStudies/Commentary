import { GraphQLString, GraphQLID, GraphQLList } from 'graphql';

// types
import { CommenterType } from '/imports/graphql/types/models/commenter';

// logic
import CommentersService from '../logic/commenters';

const commenterQueryFields = {
	commenters: {
		type: new GraphQLList(CommenterType),
		description: 'Get list of all commenters',
		args: {
			_id: {
				type: GraphQLString,
			},
			tenantId: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { _id, tenantId }, {token}) {
			const commentersService = new CommentersService({token});
			return await commentersService.commentersGet(_id, tenantId);
		},
	},
};


export default commenterQueryFields;
