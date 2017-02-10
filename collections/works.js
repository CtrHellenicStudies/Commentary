this.Works = new Meteor.Collection('works');

Schemas.Works = new SimpleSchema({
	title: {
		type: String,
		max: 60,
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
	slug: {
		type: String,
		max: 200,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
	order: {
		type: Number,
	},

	nComments: {
		type: Number,
		optional: true,
		min: 0,
	},

	subworks: {
		type: [Schemas.Subworks],
		optional: true,
	},
});

Works.attachSchema(Schemas.Works);
Works.friendlySlugs('title');

Works.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});
