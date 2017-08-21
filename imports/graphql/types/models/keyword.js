import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import Keywords from '/imports/models/keywords';


const KeywordType = SchemaBridge.schema(
	Keywords.schema,
	'Keyword',
	{
		wrap: false,
		fields: ['tenantId', 'title', 'slug', 'description', 'type', 'count', 'lineFrom', 'lineTo', 'lineLetter', 'nLines'],
	}
);


export default KeywordType;
