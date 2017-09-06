import {GraphQLID, GraphQLList} from 'graphql';

// types
import { TenantType } from '/imports/graphql/types/models/tenants';

// bll
import TenantsService from '../bll/tenants';


const tenantsQueryFields = {
	tenants: {
		type: new GraphQLList(TenantType),
		description: 'Get list of tenants',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { _id }, {token}) {
			const tenantsService = new TenantsService({token});
			return await tenantsService.tenantsGet(_id);
		}
	},
};

export default tenantsQueryFields;
