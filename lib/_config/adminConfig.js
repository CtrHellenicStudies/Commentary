
import Books from '/imports/collections/books';
import Comments from '/imports/collections/comments';
import Commenters from '/imports/collections/commenters';
import DiscussionComments from '/imports/collections/discussionComments';
import Keywords from '/imports/collections/keywords';
import LinkedDataSchemas from '/imports/collections/linkedDataSchemas';
import Metafields from '/imports/collections/metafields';
import Pages from '/imports/collections/pages';
import ReferenceWorks from '/imports/collections/referenceWorks';
import Settings from '/imports/collections/settings';
import Tenants from '/imports/collections/tenants';
import Terms from '/imports/collections/terms';
import TextNodes from '/imports/collections/textNodes';
import Works from '/imports/collections/works';

this.Books = Books;
this.Comments = Comments;
this.Commenters = Commenters;
this.DiscussionComments = DiscussionComments;
this.Keywords = Keywords;
this.LinkedDataSchemas = LinkedDataSchemas;
this.Metafields = Metafields;
this.Pages = Pages;
this.ReferenceWorks = ReferenceWorks;
this.Settings = Settings;
this.Tenants = Tenants;
this.Terms = Terms;
this.TextNodes = TextNodes;
this.Works = Works;


this.AdminConfig = {
	name: Config.name,
	skin: 'blue',
	collections: {
		Comments: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Commenter',
					name: 'commenters[0].name',
				},
				{
					label: 'Work',
					name: 'work.title',
				},
				{
					label: 'Subwork',
					name: 'subwork.n',
				},
				{
					label: 'Line From',
					name: 'lineFrom',
				},
				{
					label: 'Line To',
					name: 'lineTo',
				},
			],
		},
		Commenters: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Name',
					name: 'name',
				},
			],
		},
		Works: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Keywords: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		LinkedDataSchemas: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Collection Name',
					name: 'collectionName',
				},
			],
		},
		DiscussionComments: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Pages: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		ReferenceWorks: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Books: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Title',
					name: 'title',
				},
			],
		},
		Settings: {
			color: 'blue',
			icon: 'cog',
			tableColumns: [
				{
					label: 'Name',
					name: 'name',
				},
			],
		},
		Tenants: {
			color: 'blue',
			icon: 'pencil',
			tableColumns: [
				{
					label: 'Subdomain',
					name: 'subdomain',
				},
			],
		},
	},
	dashboard: {
		homeUrl: '/admin',
	},
	autoForm: {
		omitFields: ['created', 'updated', 'createdAt', 'updatedAt'],
	},
};
