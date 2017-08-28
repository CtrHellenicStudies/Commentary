import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import WorkType from '/imports/graphql/types/models/work';

// models
import Works from '/imports/models/works';


const workQueryFields = {
	works: {
		type: WorkType,
		description: 'Get list of works',
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


			return Works.find(args, {
				sort: {
					slug: 1
				}
			}).fetch();
		}
	},
};

export default workQueryFields;
