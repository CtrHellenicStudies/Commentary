import Books from '/imports/collections/books';
import Comments from '/imports/collections/comments';
import Commenters from '/imports/collections/commenters';
import DiscussionComments from '/imports/collections/discussionComments';
import Keywords from '/imports/collections/keywords';
import LinkedDataSchemas from '/imports/collections/linkedDataSchemas';
import Pages from '/imports/collections/pages';
import ReferenceWorks from '/imports/collections/referenceWorks';
import Tenants from '/imports/collections/tenants';
import TextNodes from '/imports/collections/textNodes';
import Works from '/imports/collections/works';
import Settings from '/imports/collections/settings';

if (Meteor.isServer) {
	Meteor.publish('comments', (query, skip = 0, limit = 10) => {
		check(query, Object);
		check(skip, Number);
		check(limit, Number);

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

	Meteor.publish('comments.recent', (tenantId, limit = 3) => {
		check(limit, Number);
		check(tenantId, Match.Maybe(String));
		return Comments.find({
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


	Meteor.publish('textNodes', (textQuery, skip = 0, limit = 100) => {
		check(textQuery, Match.Maybe(Object));
		const query = textQuery || {};

		return TextNodes.find(query, {
			sort: {
				'text.n': 1,
			},
			limit,
			skip,
		});
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

	Meteor.publish('userDiscussionComments', (userId, tenantId, sortMethod = 'votes') => {
		check(userId, String);
		check(tenantId, Match.Maybe(String));

		let sort = { votes: -1, updated: -1 };

		if (sortMethod === 'recent') {
			sort = {
				updated: -1,
				votes: -1,
			};
		}

		return DiscussionComments.find({
			'user._id': userId,
			tenantId,
		}, {
			sort,
		});
	});

	Meteor.publish('keywords.all', (query = {}, skip = 0, limit = 100) => {
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

	Meteor.publish('pageImages', function pageImages(pageSlug) {
		check(pageSlug, String);
		const page = Pages.findOne({
			slug: pageSlug,
		});
		if (page) {
			const imageArray = page.headerImage;
			if (imageArray && Array.isArray(imageArray)) {
				return [
					Images.find({
						_id: {
							$in: imageArray,
						},
					}),
					/*Thumbnails.find({
					 originalId: { $in: imageArray },
					 }),*/
				];
			}
		}
		return this.ready();
	});
	Meteor.publish('pages', (slug) => {
		check(slug, String);
		let query;
		if (slug) {
			query = {
				slug,
			};
		} else {
			query = {};
		}
		return Pages.find(query);
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

	Meteor.publish('annotations.all', (skip = 0, limit = 100) => {
		check(skip, Number);
		check(limit, Number);

		return Comments.find({ isAnnotation: true }, {
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
				tenantId: 1,
			},
			skip,
			limit,
		});
	});

}
