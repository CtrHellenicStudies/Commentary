import {Meteor} from 'meteor/meteor';
import Translations from '/imports/models/translations';
import TranslationNodes from '/imports/models/translationNodes';

Meteor.methods({
	migrateTranslation: (token) => {
		check(token, String);

		const roles = ['admin'];
		if (!Meteor.users.findOne({
			roles: {$elemMatch: {$in: roles}},
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
		) {
			throw new Meteor.Error('keyword-insert', 'not-authorized');
		}
		const translations = Translations.find().map((translation) => translation._id);

		translations.forEach((translationId) => {
			const translationObject = Translations.findOne(translationId);

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
				const newNode = Object.assign({}, translationNode, translation);
				translationNodes.push(newNode);
			});

			translationNodes.forEach((translationNode) => {
				TranslationNodes.insert(translationNode);
			});
		});
	}
});
