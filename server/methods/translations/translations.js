import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Translations from '/imports/models/translations';
import { getAuthorizedUser } from '../helpers';

const translationsInsert = (token, translation) => {
	check(token, String);
	check(translation, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	return Translations.insert(translation);
};

const translationsUpdate = (token, translationId, update) => {
	check(token, String);
	check(translationId, String);
	check(update, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

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
