import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Settings from '/imports/collections/settings.js';

Meteor.methods({
	'settings.insert': (setting) => {
		check(setting, {
			name: String,
			domain: String,
			title: String,
			footer: String,
			emails: Object,
			tenantId: Match.Maybe(String),
			subtitle: Match.Maybe(String),
			homepageCover: Match.Maybe(String),
			homepageIntroductionTitle: Match.Maybe(String),
			homepageIntroductionImage: Match.Maybe(String),
			homepageIntroductionImageCaption: Match.Maybe(String),
			homepageIntroductionText: Match.Maybe(String),
			homepageIntroductionLink: Match.Maybe(String),
			homepageIntroductionLinkText: Match.Maybe(String),
			webhooksToken: String,
		});

		return Settings.insert(setting);
	},
	'settings.update': (_id, setting) => {
		check(_id, String);
		check(setting, {
			name: String,
			domain: String,
			title: String,
			footer: String,
			emails: Object,
			tenantId: Match.Maybe(String),
			subtitle: Match.Maybe(String),
			homepageCover: Match.Maybe(String),
			homepageIntroductionTitle: Match.Maybe(String),
			homepageIntroductionImage: Match.Maybe(String),
			homepageIntroductionImageCaption: Match.Maybe(String),
			homepageIntroductionText: Match.Maybe(String),
			homepageIntroductionLink: Match.Maybe(String),
			homepageIntroductionLinkText: Match.Maybe(String),
			webhooksToken: String,
		});

		Settings.update({
			_id
		}, {
			$set: setting,
		});
	},
	'settings.remove': (settingId) => {
		check(settingId, String);

		Settings.remove({ _id: settingId });
	}
});
