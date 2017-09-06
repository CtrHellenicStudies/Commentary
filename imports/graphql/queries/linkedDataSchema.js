import { GraphQLString, GraphQLList } from 'graphql';

// types
import { LinkedDataSchemaType } from '/imports/graphql/types/models/linkedDataSchema';

// bll
import LinkedDataSchemaService from '../bll/linkedDataSchema';

const linkedDataSchemaFields = {
	linkedDataSchema: {
		type: new GraphQLList(LinkedDataSchemaType),
		description: 'Get linked data schema',
		args: {
			collectionName: {
				type: GraphQLString,
			}
		},
		async resolve(parent, { collectionName }, {token}) {
			const linkedDataSchemaService = new LinkedDataSchemaService({token});
			return await linkedDataSchemaService.linkedDataSchemaGet(collectionName);
		}
	}
};


export default linkedDataSchemaFields;
