import { Meteor } from 'meteor/meteor';
import Translations from '/imports/api/collections/translations';

Meteor.methods({
	'translations.insert': (token) => {
		check(token, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Translations.insert(translation);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
});