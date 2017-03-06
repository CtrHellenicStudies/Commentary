import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.methods({
	'users.insert': (user) => {
		check(user, {
			username: String,
			emails: Match.Maybe(Array),
			profile: {
				name: Match.Maybe(String),
				biography: Match.Maybe(String),
				publicEmailAddress: Match.Maybe(String),
				academiaEdu: Match.Maybe(String),
				twitter: Match.Maybe(String),
				facebook: Match.Maybe(String),
				google: Match.Maybe(String),
				avatarUrl: Match.Maybe(String),
				location: Match.Maybe(String),
				country: Match.Maybe(String),
			},
			services: Match.Maybe(Object),
			roles: Match.Maybe(Array),
			highlightingPreference: Match.Maybe(Boolean),
		});

		return Meteor.users.insert(user);
	},
	'users.remove': (userId) => {
		check(userId, String);

		Meteor.users.remove(userId);
	},
	'users.update': (_id, user) => {
		check(_id, String);
		check(user, {
			username: String,
			emails: Match.Maybe(Array),
			profile: {
				name: Match.Maybe(String),
				biography: Match.Maybe(String),
				publicEmailAddress: Match.Maybe(String),
				academiaEdu: Match.Maybe(String),
				twitter: Match.Maybe(String),
				facebook: Match.Maybe(String),
				google: Match.Maybe(String),
				avatarUrl: Match.Maybe(String),
				location: Match.Maybe(String),
				country: Match.Maybe(String),
			},
			services: Match.Maybe(Object),
			roles: Match.Maybe(Array),
			highlightingPreference: Match.Maybe(Boolean),
		});

		Meteor.users.update({
			_id
		}, {
			$set: user,
		});
	}
});
