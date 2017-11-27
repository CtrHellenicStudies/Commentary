/**
 * Mutations for books
 */
 
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

// types
import {EditionsType, EditionsInputType} from '/imports/graphql/types/models/editions';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import EditionsService from '../logic/Editions/editions';

const editionMutationFields = {
	editionsInsert: {
		type: EditionsType,
		description: 'Create new edition',
		args: {
			edition: {
				type: new GraphQLNonNull(EditionsInputType)
			},
			multiline: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve(parent, { edition, multiline }, {token}) {
			const editionsService = new EditionsService({token});
			return editionsService.editionInsert(edition, multiline);
		}
	},
	editionsRemove: {
		type: RemoveType,
		description: 'Remove edition',
		args: {
			edition: {
				type: new GraphQLNonNull(EditionsInputType)
			},
			multiline: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { edition, multiline }, {token}) {
			const editionsService = new EditionsService({token});
			return await editionsService.removeEdition(edition, multiline);
		}
	},
};

export default editionMutationFields;
