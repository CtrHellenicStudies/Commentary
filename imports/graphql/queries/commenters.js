import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import CommenterType from '/imports/graphql/types/models/commenter';

// models
import Commenters from '/imports/models/commenters';


const commenterQueryFields = {
	commenters: {
		type: CommenterType,
		description: 'Get list of all commenters',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		resolve({ tenantId }, context) {
			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return Commenters.find(args, {
				sort: {
					slug: 1
				},
			}).fetch();
		},
	},
};


export default commenterQueryFields;
