import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { queryCommentWithKeywordId } from '../utils.js';

Meteor.publish('comments.keyword_context', (keywordId, tenantId) => {
	check(keywordId, String);
	check(tenantId, String);

	return queryCommentWithKeywordId(keywordId, tenantId);
});

Meteor.publish('textnodes.keyword_context', (lemmaQuery) => {
	check(lemmaQuery, {
		'work.slug': String,
		'subwork.n': Match.Integer,
		'text.n': Match.Where((x) => {
			check(x.$gte, Match.Integer);
			check(x.$lte, Match.Integer);
			return x.$lte >= x.$gte;
		}),
	});

	return TextNodes.find(lemmaQuery, {
		limit: 50,
		sort: { 'text.n': 1 },
		fields: { work: 1, subwork: 1, text: 1 }
	});

});
