import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';

// models
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';

const commenterSchema = SchemaBridge.schema(
	Commenters.schema,
	'Commentator',
	{
		wrap: false,
		fields: ['tenantId', 'name', 'slug', 'avatar', 'bio', 'isAuthor', 'tagline', 'nCommentsTotal'],
	}
);

const config = {
	name: 'CommenterType',
	description: 'Commenter base schema',
	class: 'GraphQLObjectType',
	schema: commenterSchema,
	exclude: ['_id'],
	extend: {
		comments: {
			type: new GraphQLList(CommentType),
			description: 'Get all comments for commenter',
			resolve(commenter, args, context) {
				return Comments.find({
					'commenters._id': commenter._id,
				});
			}
		},
	}
};

const CommenterType = createType(config);

export default CommenterType;
