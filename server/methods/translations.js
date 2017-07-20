import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Translations from '/imports/api/collections/translations';


const checkTranslation = translation => {
	check(translation, Object);
};

Meteor.methods({
	'translations.insert': (translation) => { // eslint-disable-line
		checkTranslation(translation);
		console.log('all clear for take off');

		const roles = ['editor', 'admin', 'commenter'];
		return Translations.insert(translation);
	},
});
