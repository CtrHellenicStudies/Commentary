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
};

export default settingsQueryFields;
