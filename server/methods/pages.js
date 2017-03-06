import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Pages from '/imports/collections/pages.js';

Meteor.methods({
	'pages.insert': (page) => {
		check(page, {
			title: String,
			slug: String,
			subtitle: Match.Maybe(String),
			headerImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
			content: Match.Maybe(String),
		});

		return Pages.insert(page);
	},
	'pages.update': (_id, page) => {
		check(_id, String);
		check(page, {
			title: String,
			slug: String,
			subtitle: Match.Maybe(String),
			headerImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
			content: Match.Maybe(String),
		});

		Pages.update({
			_id
		}, {
			$set: page,
		});
	},
	'pages.remove': (pageId) => {
		check(pageId, String);

		Pages.remove({ _id: pageId });
	}
});
