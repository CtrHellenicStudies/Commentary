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

	Meteor.publish('commenters', (limit = 100) => {
		return Commenters.find({}, {
			limit,
			sort: {
				name: 1,
			},
		});
	});

	Meteor.publish('commenters.featureOnHomepage', (limit = 100) => {
		return Commenters.find({
			featureOnHomepage: true,
		}, {
			limit,
			sort: {
				name: 1,
			},
		});
	});

	Meteor.publish('discussionComments', (commentId, sortMethod = 'votes') => {
		check(commentId, String);
		let sort = { votes: -1, updated: -1 };

		if (sortMethod === 'recent') {
			sort = {
				updated: -1,
				votes: -1,
			};
		}

		return DiscussionComments.find({
			commentId,
		}, {
			sort,
		});
	});

	Meteor.publish('userDiscussionComments', (userId, sortMethod = 'votes') => {
		check(userId, String);
		let sort = { votes: -1, updated: -1 };

		if (sortMethod === 'recent') {
			sort = {
				updated: -1,
				votes: -1,
			};
		}

		return DiscussionComments.find({
			'user._id': userId,
		}, {
			sort,
		});
	});

	Meteor.publish('keywords.all', (limit = 100) =>
		Keywords.find({}, {
			limit,
			sort: {
				title: 1,
			},
		})
	);

	Meteor.publish('keywords.slug', (slug) => {
		check(slug, String);
		return Keywords.find({
			slug,
		}, {
			limit: 1,
		});
	});

	Meteor.publish('keywords.keywords', (limit = 100) =>
		Keywords.find({
			type: 'word'
		}, {
			limit,
			sort: {
				title: 1,
			},
		})
	);

	Meteor.publish('keywords.keyideas', (limit = 100) =>
		Keywords.find({
			type: 'idea'
		}, {
			limit,
			sort: {
				title: 1,
			},
		})
	);

	Meteor.publish('revisions', () =>
		Revisions.find()
	);

	Meteor.publish('subworks', () =>
		Subworks.find()
	);

	Meteor.publish('works', () =>
		Works.find({}, {
			sort: {
				order: 1,
			},
		})
	);

	Meteor.publish('referenceWorks', () =>
		ReferenceWorks.find({}, { sort: { title: 1 } })
	);

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
						_id: { $in: imageArray },
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
}
