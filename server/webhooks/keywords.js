import { Meteor } from 'meteor/meteor';

import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import Settings from '/imports/models/settings';
import Tenants from '/imports/models/tenants';
import Works from '/imports/models/works';


/**
 * Webhook publishing of keywords from previous iteration of project with SQL db
 */
Meteor.method('publishKeywords', (keywordCandidate) => {
	check(keywordCandidate.wordpressId, Match.Maybe(Number));
	check(keywordCandidate.slug, String);
	check(keywordCandidate.title, String);
	check(keywordCandidate.type, String);
	check(keywordCandidate.subdomain, String);
	check(keywordCandidate.token, String);


	const tenant = Tenants.findOne({ subdomain: keywordCandidate.subdomain });
	const settings = Settings.findOne({ tenantId: tenant._id });

	if (!settings || settings.webhooksToken !== keywordCandidate.token) {
		throw new Error('Webhook publishing not authorized');
	}

	if (keywordCandidate.type !== 'word' && keywordCandidate.type !== 'idea') {
		throw new Error(
			`type must be word or idea; was ${keywordCandidate.type}`);
	}


	if (!tenant) {
		throw new Error(
			`could not find tenant for given subdomain; was ${keywordCandidate.subdomain}`);
	}

	const keywordDoc = {
		tenantId: tenant._id,
		title: keywordCandidate.title,
		slug: keywordCandidate.slug,
		type: keywordCandidate.type,
	};

	if (keywordCandidate.wordpressId) {
		keywordDoc.wordpressId = keywordCandidate.wordpressId;
	}

	const upsertResult = Keywords.upsert(
		{ slug: keywordCandidate.slug },
		{ $set: keywordDoc });

}, {
	url: 'tags/webhook',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;
		return [content];
	},
});
