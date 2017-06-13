import { Meteor } from 'meteor/meteor';
import Translations from '/imports/api/collections/translations';

Meteor.methods({
	'translations.insert': (translation) => {
		console.log("hi this is the server speaking. everything looks good here so far capitan. youre cleared for lift off")
		return Translations.insert(translation);
	},
});