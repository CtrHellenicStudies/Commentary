import {Meteor} from 'meteor/meteor';
import Translations from '/imports/models/translations';

Meteor.methods({
	migrateTranslation: (token, id) => {
		check(token, String);
		check(id, String);

		console.log('Accounts._hashLoginToken(token) LOG', Accounts._hashLoginToken(token));

		const roles = ['admin'];
		if (!Meteor.users.findOne({
			roles: {$elemMatch: {$in: roles}},
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
		) {
			throw new Meteor.Error('keyword-insert', 'not-authorized');
		}
		const translations = Translations.distinct('_id');

		translations.forEach((translationId) => {
			const translationObject = Translations.findOne(id);

			const translationNode = {
				tenantId: translationObject.tenantId,
				author: translationObject.author,
				work: translationObject.work,
				subwork: translationObject.subwork,
			};
			if (translationObject.revisions.length > 1) {
				throw new Error('More than one revision - further development required. Translation id: ', translationId);
			}
			const translationNodes = [];
			translationObject.revisions[0].text.forEach((translation) => {
				const newNode = Object.assign({translationNode}, translation);
				translationNodes.push(newNode);
			});
		});
	}
});
