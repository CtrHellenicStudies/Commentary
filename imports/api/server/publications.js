import { Meteor } from 'meteor/meteor';
import { queryCommentWithKeyword } from '../api_utils.js';

Meteor.publish('comments.keyword_context', function (keyword_slug) {
	// TODO: check input
	console.log('publishing comments.keyword_context for ', keyword_slug);
	
	return queryCommentWithKeyword(keyword_slug);
});

Meteor.publish('textnodes.keyword_context', function (lemma_query) {
	// TODO: check input

	const safeQuery = {
		'work.slug': lemma_query['work.slug'],
		'subwork.n': lemma_query['subwork.n'],
		'text.n': {
				$gte: lemma_query['text.n'].$gte,
				$lte: lemma_query['text.n'].$lte,
		}
	}

	return TextNodes.find(safeQuery, {
		limit: 50,
		sort: { 'text.n':1 },
		fields: { work:1, subwork:1, text:1 }
	});

});