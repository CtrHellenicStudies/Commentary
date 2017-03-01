
import Tenants from '/imports/collections/tenants';

const DiscussionComments = new Meteor.Collection('discussionComments');

DiscussionComments.schema = new SimpleSchema({
	user: {
		type: Object,
		// Come back to this after redefining the user schemas
		blackbox: true,
	},
	content: {
		type: String,
		optional: true,
	},
	parentId: {
		type: String,
		optional: true,
	},
	commentId: {
		type: String,
		optional: true,
	},
	status: {
		type: String,
		optional: true,
	},
	votes: {
		type: Number,
		optional: true,
	},
	voters: {
		type: [String],
		optional: true,
	},
	reported: {
		type: Number,
		optional: true,
	},
	usersReported: {
		type: [String],
		optional: true,
	},
	tenantId: {
	    type: String,
	    label: "Tenant",
	    optional: true,
	    autoform: {
	    	afFieldInput: {
	    		type: "select",
		      options: function () {
		      	var tenants = [];
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
});

DiscussionComments.attachSchema(DiscussionComments.schema);

DiscussionComments.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});

export default DiscussionComments;
