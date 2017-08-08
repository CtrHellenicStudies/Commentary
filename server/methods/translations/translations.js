import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Translations from '/imports/api/collections/translations';

const translationsInsert = (translation) => {
	check(translation, Object);
	return Translations.insert(translation);
};


Meteor.methods({
	'translations.insert': translationsInsert
});

export { translationsInsert };
