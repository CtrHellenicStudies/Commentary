import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';


import { parseLiteralUrn, parseValueUrn } from '../../lib/parseUrn';
import serializeUrn from '../../lib/serializeUrn';


/**
 * Custom graphql scalar type representing a CTS URN as individual input components
 */
const CtsUrn = new GraphQLScalarType({
	name: 'CtsUrn',
	description: 'GraphQL custom scalar type to represent a CTS URN',

	parseValue(ast) {
		return parseValueUrn(ast);
	},

	serialize(value) {
		// if urn is already string, no need to serialize from other type
		if (typeof value === 'string') {
			return value;
		}

		return serializeUrn(value);
	},

	parseLiteral(ast) {
		return parseLiteralUrn(ast);
	},

});


export default CtsUrn;
