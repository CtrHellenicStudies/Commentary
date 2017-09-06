import { GraphQLID, GraphQLList } from 'graphql';

// types
import { SettingsType } from '/imports/graphql/types/models/settings';

// bll
import SettingsService from '../bll/settings';

const settingsQueryFields = {
	settings: {
		type: new GraphQLList(SettingsType),
		description: 'Get list of all setings',
		args: {
			tenantId: {
				type: GraphQLID,
			}
		},
		async resolve(parent, { tenantId }, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingsGet(tenantId);
		}
	},
};

export default settingsQueryFields;
