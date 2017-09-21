import { GraphQLID, GraphQLList } from 'graphql';

// types
import { TranslationType } from '/imports/graphql/types/models/translation';

// bll
import TranslationService from '../bll/translations';

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
};

export default translationsQueryFields;