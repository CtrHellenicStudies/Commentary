import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';

// types
import CommentType from '/imports/graphql/types/models/comment';


const CommenterType = SchemaBridge.schema(
	Commenters.schema,
	'Commentator',
	{
		wrap: false,
		fields: ['tenantId', 'name', 'slug', 'avatar', 'bio', 'isAuthor', 'tagline', 'nCommentsTotal'],
	}
);

export default CommenterType;
