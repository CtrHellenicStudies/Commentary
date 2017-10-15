import {GraphQLString, GraphQLList} from 'graphql';

// types
import { TenantType } from '/imports/graphql/types/models/tenants';

// logic
import TenantsService from '../logic/tenants';


const tenantsQueryFields = {
	tenants: {
		type: new GraphQLList(TenantType),
		description: 'Get list of tenants',
		args: {
			tenantId: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { tenantId }, {token}) {
			const tenantsService = new TenantsService({token});
			return await tenantsService.tenantsGet(tenantId);
		}
	},
	tenantBySubdomain: {
		type: TenantType,
		description: 'Get tenant by subdomain',
		args: {
			subdomain: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { subdomain }, {token}) {
			const tenantsService = new TenantsService({token});
			return await tenantsService.tenantBySubdomainGet(subdomain);
		}
	},
};

export default tenantsQueryFields;
