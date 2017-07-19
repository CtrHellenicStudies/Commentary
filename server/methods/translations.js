import { Meteor } from 'meteor/meteor';
import Translations from '/imports/api/collections/translations';

Meteor.methods({
	'translations.insert': (translation) => {
		console.log('all clear for take off');
		
		const roles = ['editor', 'admin', 'commenter'];
		return Translations.insert(translation);
	},
});
