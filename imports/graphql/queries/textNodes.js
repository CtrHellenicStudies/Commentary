import { GraphQLID, GraphQLList, GraphQLInt, GraphQLString, } from 'graphql';

// types
import TextNodeType from '/imports/graphql/types/models/textNode';

// bll
import TextNodesService from '../bll/textNodes';


const textNodeQueryFields = {
	textNodes: {
		type: new GraphQLList(TextNodeType),
		description: 'List textNodes for reading environment',
		args: {
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
		async resolve(parent, { tenantId, limit, skip, workSlug, subworkN, editionSlug, lineFrom, lineTo }, {token}) {
			const textNodesService = new TextNodesService({token});
			return await textNodesService.textNodesGet(tenantId, limit, skip, workSlug, subworkN, editionSlug);
		}
	},
};

export default textNodeQueryFields;
