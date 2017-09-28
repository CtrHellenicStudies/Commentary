import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import { LinkedDataSchemaType, LinkedDataSchemaInputType } from '/imports/graphql/types/models/linkedDataSchema';
import { RemoveType } from '/imports/graphql/types/index';

// bll
import LinkedDataSchemaService from '../bll/linkedDataSchema';

const linkedDataSchemaMutationFields = {

	linkedDataSchemaRemove: {
		type: RemoveType,
		description: 'Remove a single linkedDataSchema',
		args: {
			linkedDataSchemaId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {linkedDataSchemaId}, {token}) {
			const linkedDataSchemaService = new LinkedDataSchemaService({token});
			return await linkedDataSchemaService.linkedDataSchemaRemove(linkedDataSchemaId);
		}
	},
	linkedDataSchemaUpdate: {
		type: LinkedDataSchemaType,
		description: 'Update a linkedDataSchema',
		args: {
			linkedDataSchemaId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			linkedDataSchema: {
				type: LinkedDataSchemaInputType
			}
		},
		async resolve(parent, {linkedDataSchemaId, linkedDataSchema}, {token}) {
			const linkedDataSchemaService = new LinkedDataSchemaService({token});
			return await linkedDataSchemaService.linkedDataSchemaUpdate(linkedDataSchemaId, linkedDataSchema);
		}
	},
	linkedDataSchemaCreate: {
		type: LinkedDataSchemaType,
		description: 'Create a linkedDataSchema',
		args: {
			linkedDataSchema: {
				type: LinkedDataSchemaInputType
			}
		},
		async resolve(parent, {linkedDataSchema}, {token}) {
			const linkedDataSchemaService = new LinkedDataSchemaService({token});
			return await linkedDataSchemaService.linkedDataSchemaCreate(linkedDataSchema);
		}
	}
};

export default linkedDataSchemaMutationFields;
