import {GraphQLString, GraphQLList} from 'graphql';

// types
import {ReferenceWorkType} from '/imports/graphql/types/models/referenceWork';

// logic
import ReferenceWorksService from '../logic/referenceWorks';


const referenceWorkQueryFields = {
	referenceWorks: {
		type: new GraphQLList(ReferenceWorkType),
		description: 'Get list of reference works',
		args: {
			tenantId: {
				type: GraphQLString,
			},
			id: {
				type: GraphQLString,
			}
		},
		async resolve(parent, { tenantId, id }, {token}) {
			const referenceWorksService = new ReferenceWorksService({token});
			return await referenceWorksService.referenceWorksGet(id, tenantId);
		}
	},
};

export default referenceWorkQueryFields;
