this.DiscussionComments = new Meteor.Collection('discussionComments');

Schemas.DiscussionComments = new SimpleSchema({
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
		type: [Schemas.User],
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
	created: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isInsert) {
				return new Date();
			}
			return null;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
	updated: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isUpdate) {
				return new Date();
			}
			return null;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},

});

DiscussionComments.attachSchema(Schemas.DiscussionComments);
