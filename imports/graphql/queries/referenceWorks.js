import {GraphQLID, GraphQLList} from 'graphql';

// types
import {ReferenceWorkType} from '/imports/graphql/types/models/referenceWork';

// bll
import ReferenceWorksService from '../bll/referenceWorks';


const referenceWorkQueryFields = {
	referenceWorks: {
		type: new GraphQLList(ReferenceWorkType),
		description: 'Get list of reference works',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { tenantId, id }, {token}) {
			const referenceWorksService = new ReferenceWorksService({token});
			return await referenceWorksService.referenceWorksGet(id, tenantId);
		}
	},
};

export default referenceWorkQueryFields;
