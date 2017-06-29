import Comments from '/imports/api/collections/comments';
import Commenters from '/imports/api/collections/commenters';
import Keywords from '/imports/api/collections/keywords';
import Tenants from '/imports/api/collections/tenants';
import Works from '/imports/api/collections/works';

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
		throw new Meteor.Error('Webhook publishing not authorized');
	}

	if (keywordCandidate.type !== 'word' && keywordCandidate.type !== 'idea') {
		throw new Meteor.Error(
			`type must be word or idea; was ${keywordCandidate.type}`);
	}


	if (!tenant) {
		throw new Meteor.Error(
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

	/*
	console.log('keyword upsert: numberAffected=',
		upsertResult.numberAffected,
		', insertedId=',
		upsertResult.insertedId);
	*/
}, {
	url: 'tags/webhook',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;
		return [content];
	},
});
