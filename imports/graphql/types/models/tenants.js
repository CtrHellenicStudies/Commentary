import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';

const TenantType = new GraphQLObjectType({
	name: 'Tenant',
	description: 'Tenant db record',
	fields: {
		_id: {
			type: GraphQLString
		},
		subdomain: {
			type: GraphQLString
		},
		isAnnotation: {
			type: GraphQLBoolean,
		}
	},
});

const TenantInputType = new GraphQLInputObjectType({
	name: 'TenantInputType',
	description: 'Tenant db record',
	fields: {
		subdomain: {
			type: GraphQLString
		},
		isAnnotation: {
			type: GraphQLBoolean,
		}
	},
});

export {TenantType, TenantInputType};
