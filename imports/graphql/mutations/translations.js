/**
 * Mutations for text nodes
 */

import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';


// types
import { TranslationType, TranslationInputType } from '/imports/graphql/types/models/translation';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import TranslationService from '../logic/Translations/translations';

const translationsMutationFields = {
	translationRemove: {
		type: RemoveType,
		description: 'Remove a single translation',
		args: {
			translationId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { translationId }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationRemove(translationId);
		}
	},
};

export default translationsMutationFields;
