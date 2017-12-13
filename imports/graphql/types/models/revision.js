import {
	GraphQLString,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLDate from 'graphql-date';
import GraphQLJSON from 'graphql-type-json';


/**
 * Revision input type
 * @type {GraphQLInputObjectType}
 */
const RevisionInputType = new GraphQLInputObjectType({
	name: 'RevisionInputType',
	description: 'A revision of a comment (or annotation)',
	fields: {
		title: {
			type: GraphQLString,
		},
		text: {
			type: GraphQLString,
		},
		textRaw: {
			type: GraphQLJSON,
		},
		created: {
			type: GraphQLDate,
		},
		slug: {
			type: GraphQLString
		}
	},
});

export { RevisionInputType };
