import Tenants from '/imports/collections/tenants';


const Comments = new Meteor.Collection('comments');

Comments.schema = new SimpleSchema({

	status: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	tenantId: {
		type: String,
		label: 'Tenant',
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'select',
				options() {
					const tenants = [];
					_.map(Tenants.find().fetch(), function (tenant) {

						tenants.push({
							label: tenant.subdomain,
							value: tenant._id
						});

					});
					return tenants;
				}
			}
		}
	},

	commenters: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	users: {
		type: [String],
		optional: true,
	},

	work: {
		type: Object,
		optional: true,
		blackbox: true,

	},

	subwork: {
		type: Object,
		optional: true,
		blackbox: true,

	},

	lineFrom: {
		type: Number,
		optional: true,
	},

	lineTo: {
		type: Number,
		optional: true,
	},

	lineLetter: {
		type: String,
		optional: true,
	},

	bookChapterUrl: {
		type: String,
		optional: true,
	},

	paragraphN: {
		type: Number,
		optional: true,
	},

	nLines: {
		type: Number,
		optional: true,
	},

	commentOrder: {
		type: Number,
		optional: true,
	},

	reference: {
		type: String,
		optional: true,
	},

	referenceLink: {
		type: String,
		optional: true,
	},

	referenceSection: {
		type: Number,
		optional: true,
	},

	referenceChapter: {
		type: Number,
		optional: true,
	},

	referenceTranslation: {
		type: Number,
		optional: true,
	},

	referenceNote: {
		type: Number,
		optional: true,
	},

	keywords: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	revisions: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	discussionComments: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	isAnnotation: {
		type: Boolean,
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
});

Comments.attachSchema(Comments.schema);

Comments.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});

export default Comments;
