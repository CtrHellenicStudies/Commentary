const Books = new Meteor.Collection('books');
import Tenants from '/imports/collections/tenants';

Books.schema = new SimpleSchema({
  title: {
    type: String
  },
	slug: {
		type: String,
		optional: true,
	},
  author: {
    type: String,
		optional: true,
  },
  chapters: {
    type: [Object],
		optional: true,
  },
  "chapters.$.url": {
    type: String,
		optional: true,
  },
  "chapters.$.title": {
    type: String,
		optional: true,
  },
  "chapters.$.n": {
    type: Number,
		optional: true,
  },
  "chapters.$.slug": {
    type: String,
		optional: true,
  },
  coverImage: {
    type: String,
		optional: true,
  },
  year: {
    type: Number,
		optional: true,
  },
  publisher: {
    type: String,
		optional: true,
  },
  citation: {
    type: String,
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

Books.attachSchema(Books.schema);
Books.attachBehaviour('timestampable');

export default Books;
