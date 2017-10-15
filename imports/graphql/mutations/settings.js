/**
 * Mutations for settings
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import { SettingsType, SettingsInputType } from '/imports/graphql/types/models/settings';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import SettingsService from '../logic/settings';

const settingsMutationFields = {

	settingsRemove: {
		type: RemoveType,
		description: 'Remove a single settings',
		args: {
			settingsId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {settingsId}, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingsRemove(settingsId);
		}
	},
	settingsUpdate: {
		type: SettingsType,
		description: 'Update a settings',
		args: {
			settingsId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			settings: {
				type: SettingsInputType
			}
		},
		async resolve(parent, {settingsId, settings}, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingsUpdate(settingsId, settings);
		}
	},
	settingsCreate: {
		type: SettingsType,
		description: 'Create a settings',
		args: {
			settings: {
				type: SettingsInputType
			}
		},
		async resolve(parent, {settings}, {token}) {
			const settingsService = new SettingsService({token});
			return await settingsService.settingsCreate(settings);
		}
	}
};

export default settingsMutationFields;
