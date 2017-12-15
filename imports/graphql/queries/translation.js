/**
 * Queries for translations
 */
import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';

// types
import { TranslationType } from '/imports/graphql/types/models/translation';

// logic
import TranslationService from '../logic/Translations/translations';

const translationsQueryFields = {
	translations: {
		type: new GraphQLList(TranslationType),
		description: 'Get list of translations',
		args: {
			tenantId: {
				type: GraphQLID,
			}
		},
		async resolve(parent, { tenantId }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.translationGet(tenantId);
		}
	},
	authors: {
		type: new GraphQLList(TranslationType),
		description: 'Get list of authors for translation',
		args: {
			selectedWork: {
				type: GraphQLString
			},
			selectedSubwork: {
				type: GraphQLString
			}
		},
		async resolve(parent, { selectedWork, selectedSubwork }, {token}) {
			const translationService = new TranslationService({token});
			return await translationService.getAuthors(selectedWork, selectedSubwork);
		}
	}
};

export default translationsQueryFields;
