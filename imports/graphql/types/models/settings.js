import {
	GraphQLString,
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLList,
	GraphQLInputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const SettingsType = new GraphQLObjectType({
	name: 'SettingsType',
	description: 'Settings',
	fields: {
		_id: {
			type: GraphQLString,
		},
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
		aboutURL: {
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
		},
		introBlocks: {
			type: new GraphQLList(GraphQLJSON),
		}
	},
});
const SettingsInputType = new GraphQLInputObjectType({
	name: 'SettingsInputType',
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
		aboutURL: {
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
		},
		introBlocks: {
			type: new GraphQLList(GraphQLJSON),
		}
	},
});
export {SettingsType, SettingsInputType};
