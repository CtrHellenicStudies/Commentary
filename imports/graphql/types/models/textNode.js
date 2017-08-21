import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import TextNodes from '/imports/models/textNodes';


const TextNodeType = SchemaBridge.schema(
	TextNodes.schema,
	'TextNode',
	{
		wrap: false,
		fields: ['tenantId', 'work', 'subwork']
	}
);


export default TextNodeType;
