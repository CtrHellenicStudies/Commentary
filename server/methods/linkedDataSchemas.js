import { Meteor } from 'meteor/meteor';
import LinkedDataSchemas from '/imports/api/collections/linkedDataSchemas';

Meteor.methods({
	'linkedDataSchemas.insert': (token, linkedDataSchema) => {
		check(token, String);
		check(linkedDataSchema, {
			collectionName: String,
			tenantId: Match.Maybe(String),
		});
		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return LinkedDataSchemas.insert(linkedDataSchema);
		}
		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},

	'linkedDataSchemas.update': (token, _id, linkedDataSchema) => {
		check(token, String);
		check(_id, String);
		check(linkedDataSchema, {
			collectionName: String,
			tenantId: Match.Maybe(String),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return LinkedDataSchemas.update({
				_id
			}, {
				$set: linkedDataSchema,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},

	'linkedDataSchemas.remove': (token, linkedDataSchemaId) => {
		check(token, String);
		check(linkedDataSchemaId, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return LinkedDataSchemas.remove(linkedDataSchemaId);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	}
});
