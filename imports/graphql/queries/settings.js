import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';

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
			},
			_id: {
				type: GraphQLString
			}
		},
		async resolve(parent, { _id, tenantId }, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingsGet(_id, tenantId);
		}
	},
	settingPublic: {
		type: SettingsType,
		description: 'Get a public setting document for a supplied tenantId',
		args: {
			tenantId: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { tenantId }, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingGetPublic(tenantId);
		}
	},
};

export default settingsQueryFields;
