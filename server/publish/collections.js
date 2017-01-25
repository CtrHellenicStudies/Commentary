/*
 * Replace these in the future as they will publish our entire collections.
 */

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
		check(tenantId, String);
		check(limit, Number);

		return Comments.find({
			tenantId: tenantId
		}, {
			limit,
			sort: {
				updated: -1,
			},
		});
	});

	Meteor.publish('comments.id', (_id, tenantId) => {
		check(_id, String);
		check(tenantId, String);
		return Comments.find({
			_id,
			tenantId: tenantId
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


	Meteor.publish('textNodes', (textQuery) => {
		check(textQuery, Object);
		const query = textQuery || {};

		return TextNodes.find(query, {
			limit: 100,
			sort: {
				'text.n': 1,
			},
		});
	});

	Meteor.publish('commenters', (tenantId, limit = 100) => {
		check(tenantId, String);
		return Commenters.find({
			tenantId: tenantId
		}, {
			limit,
			sort: {
				name: 1,
			},
		});
	});

	Meteor.publish('commenters.featureOnHomepage', (tenantId, limit = 100) => {
		check(tenantId, String);
		return Commenters.find({
			featureOnHomepage: true,
			tenantId: tenantId
		}, {
			limit,
			sort: {
				name: 1,
			},
		});
	});

	Meteor.publish('commenters.slug', (slug, tenantId) => {
		check(slug, String);
		check(tenantId, String);
		return Commenters.find({
			slug,
			tenantId: tenantId
		}, {
			limit: 1,
			sort: {
				name: 1,
			},
		});
	});

	Meteor.publish('discussionComments', (commentId, tenantId) => {
		check(commentId, String);
		check(tenantId, String);

		return DiscussionComments.find({
			commentId,
			tenantId
		});
	});

	Meteor.publish('userDiscussionComments', (userId, tenantId, sortMethod = 'votes') => {
		check(userId, String);
		check(tenantId, String);
		let sort = { votes: -1, updated: -1 };

		if (sortMethod === 'recent') {
			sort = {
				updated: -1,
				votes: -1,
			};
		}

		return DiscussionComments.find({
			'user._id': userId,
			tenantId: tenantId
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
		})
	});

	Meteor.publish('keywords.slug', (slug, tenantId) => {
		check(slug, String);
		check(tenantId, String);
		return Keywords.find({
			slug,
			tenantId
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
		})
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
		})
	});

	Meteor.publish('revisions', () => {
		Revisions.find()
	});

	Meteor.publish('subworks', () => {
		Subworks.find()
	});

	Meteor.publish('works', (tenantId) => {
		check(tenantId, String);

		Works.find({
			tenantId: tenantId
		}, {
			sort: {
				order: 1,
			},
		})
	});

	Meteor.publish('referenceWorks', (tenantId) => {
		check(tenantId, String);

		ReferenceWorks.find({
			tenantId: tenantId
		}, {
			sort: {
				title: 1
			}
		})
	});

	Meteor.publish('referenceWorks.commenterId', (commenterId, tenantId) => {
		check(commenterId, String);
		check(tenantId, String);

		return ReferenceWorks.find({
			authors: commenterId,
			tenantId: tenantId
		}, {
			sort: {
				title: 1
			}
		})
	});

	Meteor.publish('referenceWorks.slug', (slug, tenantId) => {
		check(slug, String);
		check(tenantId, String);

		return ReferenceWorks.find({
			slug,
			tenantId: tenantId
		}, {
			limit: 1,
			sort: {
				title: 1
			}
		})
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
							$in: imageArray
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

	Meteor.publish('tenants', () => {
		return Tenants.find();
	});
}
