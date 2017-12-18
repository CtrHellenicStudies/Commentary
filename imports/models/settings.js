import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Settings are used for each tenant to store tenant-specific site title and
 * other parameters
 * @type {Meteor.Collection}
 */
const Settings = new Meteor.Collection('settings');

/**
 * Settings schema
 * @type {SimpleSchema}
 */
Settings.schema = new SimpleSchema({
	name: {
		type: String,
	},
	domain: {
		type: String,
	},
	title: {
		type: String,
	},
	subtitle: {
		type: String,
		optional: true,
	},
	footer: {
		type: String,
	},
	emails: {
		type: Object,
	},
	'emails.from': {
		type: String,
	},
	'emails.contact': {
		type: String,
	},
	tenantId: {
		type: String,
	},
	works: {
		type: [Object],
		optional: true,
	},

	webhooksToken: {
		optional: true,
		type: String,
	},

	homepageCover: {
		optional: true,
		type: Object,
	},

	'homepageCover.filename': {
		type: String,
		optional: true,
	},

	'homepageCover.src': {
		type: String,
		optional: true,
	},

	'homepageCover.type': {
		type: String,
		optional: true,
	},

	'homepageCover.size': {
		type: Number,
		optional: true,
	},

	homepageIntroduction: {
		optional: true,
		type: [Object],
	},

	homepageIntroductionImage: {
		optional: true,
		type: Object,
	},

	'homepageIntroductionImage.src': {
		type: String,
		optional: true,
	},

	'homepageIntroductionImage.filename': {
		type: String,
		optional: true,
	},

	'homepageIntroductionImage.type': {
		type: String,
		optional: true,
	},

	'homepageIntroductionImage.size': {
		type: Number,
		optional: true,
	},

	'homepageIntroductionImage.directive': {
		type: String,
		optional: true,
	},

	'homepageIntroductionImage.key': {
		type: String,
		optional: true,
	},

	homepageIntroductionImageCaption: {
		optional: true,
		type: String,
	},

	'introBlocks.$.title': {
		optional: true,
		type: String,
	},

	'introBlocks.$.text': {
		optional: true,
		type: String,
	},

	'introBlocks.$.linkURL': {
		optional: true,
		type: String,
	},

	'introBlocks.$.linkText': {
		optional: true,
		type: String,
	},

	discussionCommentsDisabled: {
		type: Boolean,
		optional: true,
	},

	aboutURL: {
		type: String,
		optional: true,
	},

});

Settings.attachSchema(Settings.schema);
Settings.friendlySlugs('name');
Settings.attachBehaviour('timestampable');

export default Settings;
