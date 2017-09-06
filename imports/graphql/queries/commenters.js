import { GraphQLID, GraphQLList } from 'graphql';

// types
import CommenterType from '/imports/graphql/types/models/commenter';

// bll
import CommentersService from '../bll/commenters';

const commenterQueryFields = {
	commenters: {
		type: new GraphQLList(CommenterType),
		description: 'Get list of all commenters',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { tenantId }, {token}) {
			const commentersService = new CommentersService({token});
			return await commentersService.commentersGet(tenantId);
		},
	},
};


export default commenterQueryFields;
