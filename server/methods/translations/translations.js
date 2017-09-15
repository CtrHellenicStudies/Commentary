import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Translations from '/imports/models/translations';

const translationsInsert = (token, translation) => {
	check(token, String);
	check(translation, Object);

	console.log(token, translation);

	return Translations.insert(translation);
};

const translationsUpdate = (token, translationId, update) => {
	check(token, String);
	check(translationId, String);
	check(update, Object);

	console.log(token, translationId, update);

	return Translations.update({
		_id: translationId
	}, {
		$set: update,
	});
};

Meteor.methods({
	'translations.insert': translationsInsert,
	'translations.update': translationsUpdate,
});

export {
	translationsInsert,
	translationsUpdate,
 };
