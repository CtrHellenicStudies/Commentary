this.Keywords = new Meteor.Collection('keywords');

Schemas.Keywords = new SimpleSchema({
	_id: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	title: {
		type: String,
		// optional: true,
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

	description: {
		type: String,
		optional: true,
	},

	type: {
		type: String,
		optional: true,
		defaultValue: 'word',
	},

	count: {
		type: Number,
		optional: true,
	},

	work: {
		type: Object,
		blackbox: true,
		optional: true,

	},

	subwork: {
		type: Object,
		blackbox: true,
		optional: true,

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

	nLines: {
		type: Number,
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

Keywords.attachSchema(Schemas.Keywords);
Keywords.friendlySlugs('title');

Keywords.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});
