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
import Translations from '/imports/models/translations';
import Editions from '/imports/models/editions';

if (Meteor.isServer) {
	Meteor.publish('comments', (query, skip = 0, limit = 10) => {
		check(query, Object);
		check(skip, Number);
		check(limit, Number);

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


	Meteor.publish('textNodes', (query = {}, skip = 0, limit = 100) => {
		check(query, Object);
		check(skip, Number);
		check(limit, Number);

		return TextNodes.find(query, {
			skip,
			limit,
		});
	});

	Meteor.publish('editions', (tenantId) => {
		check(tenantId, Match.Maybe(String));

		const query = {};
		if (tenantId) {
			query.tenantId = tenantId;
		}

		return Editions.find(query);
	});

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

	Meteor.publish('discussionComments', (commentId, tenantId) => {
		check(commentId, String);
		check(tenantId, Match.Maybe(String));

		return DiscussionComments.find({
			commentId,
			tenantId,
		});
	});

	Meteor.publish('keywords.all', (query = {}) => {
		check(query, Object);

		return Keywords.find(query, {
			sort: {
				title: 1,
			},
		});
	});

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

	Meteor.publish('pageImages', (tenantId, slug) => {
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

	Meteor.publish('pages', (tenantId, slug) => {
		check(tenantId, Match.Maybe(String));
		check(slug, String);

		return Pages.find({
			tenantId,
			slug,
		});
	});

	Meteor.publish('pages.all', () => Pages.find({}, { sort: { tenantId: 1, title: 1 }}));

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

	Meteor.publish('works.all', () => Works.find({}, {sort: {tenantId: 1, order: 1, title: 1}}));

	Meteor.publish('referenceWorks.all', () => ReferenceWorks.find({}, { sort: { tenantId: 1, title: 1 }}));

	Meteor.publish('commenters.all', () => Commenters.find({}, { sort: { tenantId: 1, name: 1 }}));

	Meteor.publish('books', () => Books.find({}, { sort: { tenantId: 1, title: 1 }}));

	Meteor.publish('tenants', () => Tenants.find({}, { sort: { subdomain: 1 } }));

	Meteor.publish('settings', () => Settings.find({}, { sort: { tenantId: 1 }}));

	Meteor.publish('translations', () => Translations.find({}, { sort: { tenantId: 1 }}));

	Meteor.publish('translationNodes', () => TranslationNodes.find({}, { sort: { tenantId: 1 }}));

	Meteor.publish('translationNodes.work', (tenantId, workId, subwork, author, skip = 0, limit = 100) => {
		check(tenantId, String);
		check(workId, String);
		check(parseInt(subwork), Number);
		check(author, String);
		check(parseInt(skip), Number);
		check(parseInt(limit), Number);
		
		const work = Works.findOne(workId).slug;
		const result = TranslationNodes.find({
			work,
			subwork,
			tenantId,
			author,
			$and: [{n: {$gte: parseInt(skip)}}, {n: {$lte: parseInt(skip) + parseInt(limit) - 1}}]
		}, {sort: {tenantId: 1}});
		return result;
	});

	Meteor.publish('settings.tenant', (tenantId) => {
		check(tenantId, Match.Maybe(String));
		return Settings.find({ tenantId });
	});

	Meteor.publish('linkedDataSchemas', () => LinkedDataSchemas.find({}, { sort: { tenantId: 1, collectionName: 1 } }));

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

}
