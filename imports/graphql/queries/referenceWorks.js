import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import ReferenceWorkType from '/imports/graphql/types/models/referenceWork';

// models
import ReferenceWorks from '/imports/models/referenceWorks';


const referenceWorkQueryFields = {
	referenceWorks: {
		type: ReferenceWorkType,
		description: 'Get list of reference works',
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


			return ReferenceWorks.find(args, {
				sort: {
					slug: 1
				}
			}).fetch();
		}
	},
};

export default referenceWorkQueryFields;