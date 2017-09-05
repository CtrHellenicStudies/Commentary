import {GraphQLID, GraphQLList} from 'graphql';

// types
import { TenantType } from '/imports/graphql/types/models/tenants';

// models
import Tenants from '/imports/models/tenants';


const tenantsQueryFields = {
	tenants: {
		type: new GraphQLList(TenantType),
		description: 'Get list of tenants',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		resolve(parent, { _id }, context) {
			const args = {};

			if (_id) {
				args._id = _id;
			}

			return Tenants.find(args).fetch();
		}
	},
};

export default tenantsQueryFields;
