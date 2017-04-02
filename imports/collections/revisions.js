import Tenants from '/imports/collections/tenants';

const Revisions = new Meteor.Collection('revisions');

Revisions.schema = new SimpleSchema({
	title: {
		type: String,
		optional: true,
	},

	slug: {
		type: String,
		optional: true,
	},

	tenantId: {
    type: String,
    optional: true,
	},

	text: {
		type: String,
		optional: true,
	},
});

Revisions.attachSchema(Revisions.schema);
Revisions.friendlySlugs('title');

Revisions.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});

export default Revisions;
