import Tenants from '/imports/collections/tenants';


const Pages = new Meteor.Collection('pages');

Pages.schema = new SimpleSchema({
	title: {
		type: String,
	},
	subtitle: {
		type: String,
		optional: true,
	},
	headerImage: {
		type: [String],
		optional: true,
	},
	slug: {
		type: String,
		optional: true,
	},
	byline: {
		type: String,
		optional: true,
	},
	tenantId: {
    type: String,
    optional: true,
	},
	content: {
		type: String,
    optional: true,
	},
});

Pages.attachSchema(Pages.schema);
Pages.friendlySlugs('title');
Pages.attachBehaviour('timestampable');

export default Pages;
