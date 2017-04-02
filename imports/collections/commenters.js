import Tenants from '/imports/collections/tenants';

const Commenters = new Meteor.Collection('commenters');

Commenters.schema = new SimpleSchema({
	_id: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	tenantId: {
    type: String,
    optional: true,
	},

	name: {
		type: String,
		optional: true,
		max: 255,
	},

	slug: {
		type: String,
		max: 200,
		optional: true,
	},

	avatar: {
		type: Object,
		blackbox: true,
		optional: true,
	},

	bio: {
		type: String,
		optional: true,
	},

	isAuthor: {
		type: Boolean,
		optional: true,
	},

	tagline: {
		type: String,
		optional: true,
	},

	featureOnHomepage: {
		type: Boolean,
		optional: true,
	},

	nCommentsTotal: {
		type: Number,
		optional: true,
	},

	nCommentsWorks: {
		type: [Object],
		optional: true,
	},

	'nCommentsWorks.$': {
		type: Object,
		blackbox: true,
		optional: true,
	},

	nCommentsIliad: {
		type: Number,
		optional: true,
	},

	nCommentsOdyssey: {
		type: Number,
		optional: true,
	},

	nCommentsHymns: {
		type: Number,
		optional: true,
	},

	nCommentsKeywords: {
		type: [Object],
		optional: true,
	},

	'nCommentsKeywords.$.title': {
		type: String,
		optional: true,
	},

	'nCommentsKeywords.$.slug': {
		type: String,
		optional: true,
	},

	'nCommentsKeywords.$.count': {
		type: Number,
		optional: true,
	},
});

Commenters.attachSchema(Commenters.schema);
Commenters.friendlySlugs('name');

Commenters.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});


Commenters.allow({
  update: function(userId, doc) {
	return true;
  },
});

export default Commenters;
