this.Comments = new Meteor.Collection('comments');

Schemas.Comments = new SimpleSchema({

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
		/*autoform: {
		 options: function() {
		 return _.map(Commenters.find().fetch(), function(commenter) {
		 return {
		 label: commenter.name,
		 value: commenter._id
		 };
		 });
		 }
		 }
		 */
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
		autoValue: function() {
			if (this.isInsert)
				return false;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
});

Comments.attachSchema(Schemas.Comments);

Comments.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});

/*
 Comments.helpers({
 commenters: function() {
 var ref, ref1, ref2, user;
 commenter = Commenters.findOne(this.commenter);
 if (commenter != null) {
 return commenter.name;
 } else {
 return null;
 }
 }
 });
 */
/*
 Comments.helpers({
 commentTitle: function(){
 var comment_title = "";
 console.log(this);

 if(this.work){
 comment_title += this.work.title + " ";
 }
 if(this.subwork){
 comment_title += this.subwork + ".";
 }
 if(this.lineFrom){
 comment_title += this.lineFrom;
 }

 if(this.lineTo){
 comment_title += "-" + this.lineTo;

 }

 return comment_title;
 }
 });
 */
