import {
	GraphQLString,
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const SettingsType = new GraphQLObjectType({
	name: 'SettingsType',
	description: 'Settings',
	fields: {
		name: {
			type: GraphQLString,
		},
		domain: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString,
		},
		subtitle: {
			type: GraphQLString,
		},
		footer: {
			type: GraphQLString,
		},
		emails: {
			type: GraphQLJSON,
		},
		tenantId: {
			type: GraphQLString,
		},
		webhooksToken: {
			type: GraphQLString,
		},
		homepageCover: {
			type: GraphQLJSON,
		},
		homepageIntroduction: {
			type: new GraphQLList(GraphQLJSON),
		},
		homepageIntroductionImage: {
			type: GraphQLJSON,
		},
		homepageIntroductionImageCaption: {
			type: GraphQLString,
		},
		discussionCommentsDisabled: {
			type: GraphQLBoolean,
		}
	},
});
export {SettingsType}