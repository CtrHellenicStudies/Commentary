import { Meteor } from 'meteor/meteor';
import Translations from '/imports/models/translations';
import TranslationNodes from '/imports/models/translationNodes';
import { Accounts } from 'meteor/accounts-base';

const fixTranslationNodes = () => {

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
			if (translation.text) {
				const newNode = Object.assign({}, translationNode, translation);
				translationNodes.push(newNode);
			}
		});

		translationNodes.forEach((_translationNode) => {
			TranslationNodes.insert(_translationNode);
		});
	});
};

/*
// Method for running migration
Meteor.method('translationNodes', () => {
	translationNodes();
}, {
	url: 'fix/translationNodes',
});
*/
