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
import { WorkInputType } from '/imports/graphql/types/models/work';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import TranslationService from '../logic/Translations/translations';

const translationsMutationFields = {
	translationRemove: {
		type: RemoveType,
		description: 'Remove a single translation',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { translationId }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationRemove(id);
		}
	},
	translationUpdate: {
		type: TranslationType,
		description: 'Update a single translation',
		args: {
			translation: {
				type: new GraphQLNonNull(TranslationInputType)
			}
		},
		async resolve(parent, { translation }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationUpdate(translation);
		}
	},
	translationInsert: {
		type: TranslationType,
		description: 'Insert a single translation',
		args: {
			translation: {
				type: new GraphQLNonNull(TranslationInputType)
			}
		},
		async resolve(parent, { translation }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationInsert(translation);
		}
	},
	translationUpdateAuthor: {
		type: TranslationType,
		description: 'Update translation author',
		args: {
			workDetails: {
				type: new GraphQLNonNull(WorkInputType)
			},
			name: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { workSlug, name }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationUpdateAuthor(workSlug, name);
		}
	},
	translationAddAuthor: {
		type: TranslationType,
		description: 'Add author to translation',
		args: {
			workDetails: {
				type: new GraphQLNonNull(WorkInputType)
			},
			translation: {
				type: new GraphQLNonNull(TranslationInputType)
			},
			name: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { workSlug, translation, name }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationAddAuthor(workSlug, translation, name);
		}
	},
};

export default translationsMutationFields;
