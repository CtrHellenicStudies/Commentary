/**
 * Queries for textNodes
 */
import { GraphQLID, GraphQLList, GraphQLInt, GraphQLString, } from 'graphql';

// types
import {TextNodeType} from '/imports/graphql/types/models/textNode';

// logic
import TextNodesService from '../logic/textNodes';


const textNodeQueryFields = {
	textNodes: {
		type: new GraphQLList(TextNodeType),
		description: 'List textNodes for reading environment',
		args: {
			_id: {
				type: GraphQLID,
			},
			tenantId: {
				type: GraphQLID,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
			workSlug: {
				type: GraphQLString,
			},
			subworkN: {
				type: GraphQLInt,
			},
			lineFrom: {
				type: GraphQLInt,
			},
			lineTo: {
				type: GraphQLInt,
			},
			editionSlug: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { _id, tenantId, limit, skip, workSlug, subworkN, editionSlug, lineFrom, lineTo }, {token}) {
			const textNodesService = new TextNodesService({token});
			return await textNodesService.textNodesGet(_id, tenantId, limit, skip, workSlug, subworkN, editionSlug);
		}
	},
};

export default textNodeQueryFields;
