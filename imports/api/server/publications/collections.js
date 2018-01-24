/**
 * Publications for Mongo publications via Meteor ddp publications
 */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

// models
import Books from '/imports/models/books';
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import DiscussionComments from '/imports/models/discussionComments';
import Keywords from '/imports/models/keywords';
import LinkedDataSchemas from '/imports/models/linkedDataSchemas';
import Pages from '/imports/models/pages';
import ReferenceWorks from '/imports/models/referenceWorks';
import Tenants from '/imports/models/tenants';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';
import Settings from '/imports/models/settings';
import TranslationNodes from '/imports/models/translationNodes';
import Editions from '/imports/models/editions';

// lib
import { queryCommentWithKeywordId } from '../../../lib/utils';


/**
 * Primary publication for comments in the commentaries
 * @param {Object} query - Query for the mongo orm
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('comments', (query, skip = 0, limit = 10) => {
	check(query, Object);
	check(skip, Number);
	check(limit, Number);

	// enforce only publishing comments that are public
	query.status = 'publish';

	return Comments.find(query, {
		skip,
		limit,
		sort: {
			'work.order': 1,
			'subwork.n': 1,
			lineFrom: 1,
			nLines: -1,
		},
	});
});

/**
 * Get a selection of the most recent comments on the commentary
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of recent comments
 */
Meteor.publish('comments.recent', (skip = 0, limit = 12) => {
	check(skip, Number);
	check(limit, Number);
	return Comments.find({
		status: 'publish',
	}, {
		limit,
		sort: {
			updated: -1,
		},
	});
});

/**
 * Get a selection of the most recent comments for a specific tenant
 * @param {string} tenantId - id of current tenant
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of recent comments
 */
Meteor.publish('comments.recent.tenant', (tenantId, limit = 3) => {
	check(limit, Number);
	check(tenantId, Match.Maybe(String));
	return Comments.find({
		status: 'publish',
		tenantId,
	}, {
		limit,
		sort: {
			updated: -1,
		},
	});
});


/**
 * Get a specific comment for the supplied comment ID and tenant ID
 * @param {string} _id - id of comment
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('comments.id', (_id, tenantId) => {
	check(_id, String);
	check(tenantId, Match.Maybe(String));
	return Comments.find({
		_id,
		tenantId,
	}, {
		limit: 1,
		sort: {
			'work.order': 1,
			'subwork.n': 1,
			lineFrom: 1,
			nLines: -1,
		},
	});
});

/**
 * Get all comments across tenants
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('comments.all', (skip = 0, limit = 100) => {
	check(skip, Number);
	check(limit, Number);

	return Comments.find({}, {
		sort: {
			tenantId: 1,
			'work.order': 1,
			'subwork.n': 1,
			lineFrom: 1,
			nLines: -1,
		},
		skip,
		limit,
	});
});

/**
 * Get all comments for a supplied keyword by the keywordId
 * @param {number} keywordId - Mongo skip
 * @param {number} tenantId - Mongo limit
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('comments.keyword_context', (keywordId, tenantId) => {
	check(keywordId, String);
	check(tenantId, String);

	return queryCommentWithKeywordId(keywordId, tenantId);
});


/**
 * Get all comments of type annotations that are published across tenants
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('annotations.publish', (skip = 0, limit = 100) => {
	check(skip, Number);
	check(limit, Number);

	return Comments.find({
		status: 'publish',
		isAnnotation: true,
	}, {
		sort: {
			tenantId: 1,
			book: 1,
			paragraphN: 1,
			nLines: -1,
		},
		skip,
		limit,
	});
});

/**
 * Get all comments of type annotations across tenants
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of comments
 */
Meteor.publish('annotations.all', (skip = 0, limit = 100) => {
	check(skip, Number);
	check(limit, Number);

	return Comments.find({
		isAnnotation: true
	}, {
		sort: {
			tenantId: 1,
			book: 1,
			paragraphN: 1,
			nLines: -1,
		},
		skip,
		limit,
	});
});


/**
 * Get textnodes given a supplied query
 * @param {Object} query - Query for the mongo orm
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of textNodes
 */
Meteor.publish('textNodes', (query = {}, skip = 0, limit = 100) => {
	check(query, Object);
	check(skip, Number);
	check(limit, Number);

	return TextNodes.find(query, {
		skip,
		limit,
		sort: {
			'subwork.n': 1,
			'section.n': 1,
			'text.n': 1,
		},
	});
});

/**
 * Get textnodes for supplied keyword
 * @param {Object} lemmaQuery - Query for the mongo orm
 * @returns {Object[]} Cursor of textNodes
 */
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

/**
 * Get all editions in the commentaries
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of editions
 */
Meteor.publish('editions', (tenantId) => {
	check(tenantId, Match.Maybe(String));

	const query = {};
	if (tenantId) {
		query.tenantId = tenantId;
	}

	return Editions.find(query);
});

/**
 * Get all commenters for a supplied tenant
 * @param {string} tenantId - id of current tenant
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of commenters
 */
Meteor.publish('commenters', (tenantId, limit = 100) => {
	check(tenantId, Match.Maybe(String));

	return Commenters.find({
		tenantId,
	}, {
		limit,
		sort: {
			name: 1,
		},
	});
});

/**
 * Get all commenters
 * @returns {Object[]} Cursor of commenters
 */
Meteor.publish('commenters.all', () => Commenters.find({}, { sort: { tenantId: 1, name: 1 }}));

/**
 * Get commenters to feature on the homepage
 * @param {string} tenantId - id of current tenant
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of commenters
 */
Meteor.publish('commenters.featureOnHomepage', (tenantId, limit = 100) => {
	check(tenantId, Match.Maybe(String));
	return Commenters.find({
		featureOnHomepage: true,
		tenantId,
	}, {
		limit,
		sort: {
			name: 1,
		},
	});
});

/**
 * Get a specific commenter for the supplied commenter ID and tenant ID
 * @param {string} _id - id of commenter
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of commenters
 */
Meteor.publish('commenters._id', (_id, tenantId) => {
	check(_id, String);
	check(tenantId, Match.Maybe(String));
	return Commenters.find({
		_id,
		tenantId,
	}, {
		limit: 1,
	});
});

/**
 * Get a specific commenter for the supplied commenter slug and tenant ID
 * @param {string} slug - slug of commenter
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of commenters
 */
Meteor.publish('commenters.slug', (slug, tenantId) => {
	check(slug, String);
	check(tenantId, Match.Maybe(String));
	return Commenters.find({
		slug,
		tenantId,
	}, {
		limit: 1,
		sort: {
			name: 1,
		},
	});
});

/**
 * Publishing discussion comments for a comment ID and tenant ID
 * @param {string} commentId - id of comment
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of discussion comments
 */
Meteor.publish('discussionComments', (commentId, tenantId) => {
	check(commentId, String);
	check(tenantId, Match.Maybe(String));

	return DiscussionComments.find({
		commentId,
		tenantId,
	});
});

/**
 * Get all discussion comments
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of discussion comments
 */
Meteor.publish('discussionComments.all', (skip = 0, limit = 100) => {
	check(skip, Number);
	check(limit, Number);

	return DiscussionComments.find({}, {
		sort: {
			created: 1,
			tenantId: 1,
		},
		skip,
		limit,
	});
});

/**
 * Publish all keywords across commentaries
 * @param {Object} query - Query for the mongo orm
 * @returns {Object[]} Cursor of keywords
 */
Meteor.publish('keywords.all', (query = {}) => {
	check(query, Object);

	return Keywords.find(query, {
		sort: {
			title: 1,
		},
	});
});

/**
 * Get a specific keyword by slug
 * @param {string} slug - slug of commenter
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of keywords
 */
Meteor.publish('keywords.slug', (slug, tenantId) => {
	check(slug, String);
	check(tenantId, Match.Maybe(String));

	return Keywords.find({
		slug,
		tenantId,
	}, {
		limit: 1,
	});
});

/**
 * Get all tags of type "word"
 * @param {Object} query - Query for the mongo orm
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of keywords
 */
Meteor.publish('keywords.keywords', (query = {}, skip = 0, limit = 100) => {
	check(query, Object);
	check(skip, Number);
	check(limit, Number);

	return Keywords.find(query, {
		skip,
		limit,
		sort: {
			title: 1,
		},
	});
});

/**
 * Get all tags of type "idea"
 * @param {Object} query - Query for the mongo orm
 * @param {number} skip - Mongo skip
 * @param {number} limit - Mongo limit
 * @returns {Object[]} Cursor of keywords
 */
Meteor.publish('keywords.keyideas', (query = {}, skip = 0, limit = 100) => {
	check(query, Object);
	check(skip, Number);
	check(limit, Number);

	return Keywords.find(query, {
		skip,
		limit,
		sort: {
			title: 1,
		},
	});
});

/**
 * Get all works for a given tenant
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of works
 */
Meteor.publish('works', (tenantId) => {
	check(tenantId, Match.Maybe(String));
	return Works.find({
		tenantId,
	}, {
		sort: {
			order: 1,
		},
	});
});

/**
 * Get all works
 * @returns {Object[]} Cursor of works
 */
Meteor.publish('works.all', () => Works.find({}, {sort: {tenantId: 1, order: 1, title: 1}}));

/**
 * Get all reference works for a given tenant
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of reference works
 */
Meteor.publish('referenceWorks', (tenantId) => {
	check(tenantId, Match.Maybe(String));
	return ReferenceWorks.find({
		tenantId,
	}, {
		sort: {
			title: 1,
		},
	});
});

/**
 * Get all reference works
 * @returns {Object[]} Cursor of reference works
 */
Meteor.publish('referenceWorks.all', () => ReferenceWorks.find({}, { sort: { tenantId: 1, title: 1 }}));


/**
 * Get all reference works for a commenter (and given tenant)
 * @param {string} commenterId - id of commenter
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of reference works
 */
Meteor.publish('referenceWorks.commenterId', (commenterId, tenantId) => {
	check(commenterId, String);
	check(tenantId, Match.Maybe(String));

	return ReferenceWorks.find({
		authors: commenterId,
		tenantId,
	}, {
		sort: {
			title: 1,
		},
	});
});

/**
 * Get a specified reference work by reference work slug
 * @param {string} slug - slug of reference work
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of reference works
 */
Meteor.publish('referenceWorks.slug', (slug, tenantId) => {
	check(slug, String);
	check(tenantId, Match.Maybe(String));

	return ReferenceWorks.find({
		slug,
		tenantId,
	}, {
		limit: 1,
		sort: {
			title: 1,
		},
	});
});

/**
 * Get all images for a page
 * @param {string} slug - slug of page
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of images
 */
Meteor.publish('pageImages', (tenantId, slug) => {
	check(tenantId, String);
	check(slug, String);
	const page = Pages.findOne({
		tenantId,
		slug,
	});

	if (page) {
		const imageArray = page.headerImage;
		if (imageArray && Array.isArray(imageArray)) {
			return Images.find({
				_id: {
					$in: imageArray,
				},
			});
		}
	}

	return null;
});

/**
 * Get a specified by page by supplied slug
 * @param {string} slug - slug of page
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of pages
 */
Meteor.publish('pages', (tenantId, slug) => {
	check(tenantId, Match.Maybe(String));
	check(slug, String);

	return Pages.find({
		tenantId,
		slug,
	});
});

/**
 * Get all pages, sorted by tenantId and title
 * @returns {Object[]} Cursor of pages
 */
Meteor.publish('pages.all', () => Pages.find({}, { sort: { tenantId: 1, title: 1 }}));

/**
 * Get all books, sorted by tenantId and title
 * @returns {Object[]} Cursor of books
 */
Meteor.publish('books', () => Books.find({}, { sort: { tenantId: 1, title: 1 }}));

/**
 * Get all tenants, sorted by subdomain
 * @returns {Object[]} Cursor of tenants
 */
Meteor.publish('tenants', () => Tenants.find({}, { sort: { subdomain: 1 } }));

/**
 * Get all settings, sorted by tenantId
 * @returns {Object[]} Cursor of settings
 */
Meteor.publish('settings', () => Settings.find({}, { sort: { tenantId: 1 }}));

/**
 * Get the settings for the current tenant
 * @param {string} tenantId - id of current tenant
 * @returns {Object[]} Cursor of settings
 */
Meteor.publish('settings.tenant', (tenantId) => {
	check(tenantId, Match.Maybe(String));
	return Settings.find({ tenantId });
});


/**
 * Get all translation Nodes, sorted by tenantId
 * @returns {Object[]} Cursor of translationNodes
 */
Meteor.publish('translationNodes', () => TranslationNodes.find({}, { sort: { tenantId: 1 }}));

/**
 * Get all translation Nodes, sorted by tenantId
 * @param {string} tenantId - id of current tenant
 * @param {string} workId - id of work
 * @param {number} subwork - subwork number
 * @param {string} author - name of author
 * @param {number} skip - mongo skip
 * @param {number} limit - mongo limit
 * @returns {Object[]} Cursor of translationNodes
 */
Meteor.publish('translationNodes.work', (tenantId, workId, subwork, author, section = null, skip = 0, limit = 100) => {
	check(tenantId, String);
	check(workId, String);
	check(parseInt(subwork), Number);
	check(author, String);
	check(subwork, Number);
	check(parseInt(section), Match.Maybe(Number));
	check(parseInt(skip), Number);
	check(parseInt(limit), Number);

	const work = Works.findOne(workId).slug;
	const result = TranslationNodes.find({
		work,
		subwork,
		tenantId,
		author,
		section,
		$and: [{n: {$gte: parseInt(skip)}}, {n: {$lte: parseInt(skip) + parseInt(limit) - 1}}]
	}, {
		sort: {
			tenantId: 1,
			work: 1,
			subwork: 1,
			section: 1,
			n: 1,
		}
	});

	return result;
});

Meteor.publish('linkedDataSchemas', () => LinkedDataSchemas.find({}, { sort: { tenantId: 1, collectionName: 1 } }));
