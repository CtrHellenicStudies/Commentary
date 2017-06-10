import { Meteor } from 'meteor/meteor';
import Translations from '/imports/api/collections/translations';

Meteor.methods({
	'translations.insert': (translation) => {
		translationId = Translations.insert(translation);
		return translationId;
	},
});