import { GraphQLID, GraphQLList } from 'graphql';

// types
import { WorkType } from '/imports/graphql/types/models/work';

// logic
import WorksService from '../logic/works';


const workQueryFields = {
	works: {
		type: new GraphQLList(WorkType),
		description: 'Get list of works',
		args: {
			tenantId: {
				type: GraphQLID,
			},
			_id: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { _id, tenantId }, {token}) {
			const worksService = new WorksService({token});
			return await worksService.worksGet(_id, tenantId);
		}
	},
};

export default workQueryFields;
