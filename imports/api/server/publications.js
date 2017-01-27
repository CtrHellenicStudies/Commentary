import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'
import { Match } from 'meteor/check'
import { queryCommentWithKeywordId } from '../api_utils.js';

Meteor.publish('comments.keyword_context', function (keyword_id, tenantId) {
	check(keyword_id, String);
	check(tenantId, String);

	return queryCommentWithKeywordId(keyword_id, tenantId);
});

Meteor.publish('textnodes.keyword_context', function (lemma_query) {
	check(lemma_query, {
		'work.slug': String,
		'subwork.n': Match.Integer,
		'text.n': Match.Where((x) => {
			check(x.$gte, Match.Integer);
			check(x.$lte, Match.Integer);
			return x.$lte >= x.$gte;
		}),
	});

	return TextNodes.find(lemma_query, {
		limit: 50,
		sort: { 'text.n':1 },
		fields: { work:1, subwork:1, text:1 }
	});

});
