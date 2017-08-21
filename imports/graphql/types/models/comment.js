import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import Comments from '/imports/models/comments';


const CommentType = SchemaBridge.schema(
	Comments.schema,
	'Comment',
	{
		wrap: false,
		fields: ['tenantId', 'lineFrom', 'lineTo', 'lineLetter', 'nLines', 'paragraphN', 'commentOrder', 'reference', 'referenceLink', 'referenceSection', 'referenceChapter', 'referenceTranslation', 'referenceNote', 'isAnnotation'],
	}
);


export default CommentType;
