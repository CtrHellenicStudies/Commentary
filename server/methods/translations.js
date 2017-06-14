import { Meteor } from 'meteor/meteor';
import Translations from '/imports/api/collections/translations';

Meteor.methods({
	'translations.insert': (token, translation) => {
		console.log("all clear for take off");
		console.log(translation);
		check(token, String);
		check(translation, Object);
		const roles = ['editor', 'admin', 'commenter'];
		if ((
			!Meteor.userId()
			&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: roles,
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('translation-insert', 'not-authorized');
		}
		// let translationId;
		// try {
		// 	translationId = Translations.insert(translation);
		// } catch (err) {
		// 	throw new Meteor.Error('translation-insert')
		// }
		return Translations.insert(translation);
	},
});