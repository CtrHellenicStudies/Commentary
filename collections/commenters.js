this.Commenters = new Meteor.Collection('commenters');

Schemas.Commenters = new SimpleSchema({
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

	name: {
		type: String,
		optional: true,
		max: 255,
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

	avatar: {
		type: String,
		optional: true,
		label: 'Profile picture (avatar)',
		autoform: {
			afFieldInput: {
				type: 'adminAvatarEditor',
			},
		},
	},

	bio: {
		type: String,
		optional: true,
		autoform: {
			rows: 5,
		},
	},

	isAuthor: {
		type: Boolean,
		autoValue: function() {
			if (this.isInsert)
				return false;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
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

Commenters.attachSchema(Schemas.Commenters);
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

// // Manage Roles based to commenters:
// // TODO: test all hooks
// Commenters.after.insert((userId, commneter) => {
//		 try {
//				 Roles.createRole(commneter.slug);
//				 console.log('Created role:', commneter.slug);
//		 } catch (err) {
//				 console.log(err);
//		 };
// });

// Commenters.before.update((userId, commenter, fieldNames) => {
//		 // check if slug was modified:
//		 if (fieldNames.indexOf('slug') > -1) {
//				 try {
//						 Roles.deleteRole(commenter.slug);
//						 console.log('Deleted role:', role.name);
//				 } catch (err) {
//						 if (err.error === 403) {
//								 console.log('Role \'' + role.name + '\' is in use.');
//						 } else {
//								 console.log(err);
//						 };
//				 };
//		 };
// });

// Commenters.after.update((userId, commenter, fieldNames) => {
//		 // check if slug was modified
//		 if (fieldNames.indexOf('slug') > -1) {
//				 try {
//						 Roles.createRole(commneter.slug);
//						 console.log('Created role:', commneter.slug);
//				 } catch (err) {
//						 console.log(err);
//				 };
//		 };
// });

// Commenters.before.remove((userId, commenter) => {
//		 try {
//				 Roles.deleteRole(commenter.slug);
//				 console.log('Deleted role:', role.name);
//		 } catch (err) {
//				 if (err.error === 403) {
//						 console.log('Role \'' + role.name + '\' is in use.');
//				 } else {
//						 console.log(err);
//				 };
//		 };
// });
