/**
 * Mutations for text nodes
 */

import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

// types
import { TextNodeType, TextNodeInputType } from '/imports/graphql/types/models/textNode';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import TextNodeService from '../logic/TextNodes/textNodes';

const textNodeMutationFields = {
	textNodeCreate: {
		type: TextNodeType,
		description: 'Create new textNode',
		args: {
			textNode: {
				type: new GraphQLNonNull(TextNodeInputType),
			},
		},
		async resolve(parent, { textNode }, { token }) {
			const textNodeService = new TextNodeService({token});
			return await textNodeService.textNodeCreate(textNode);
		}
	},
	textNodeRemove: {
		type: RemoveType,
		description: 'Remove a single text node',
		args: {
			textNodeId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {textNodeId}, {token}) {
			const textNodeService = new TextNodeService({token});
			return await textNodeService.textNodeRemove(textNodeId);
		}
	},
};

export default textNodeMutationFields;
