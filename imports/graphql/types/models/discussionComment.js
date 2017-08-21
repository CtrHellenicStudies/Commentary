import { GraphQLList, GraphQLID } from 'graphql';
import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';


import DiscussionComments from '/imports/models/discussionComments';


const DiscussionCommentType = SchemaBridge.schema(
	DiscussionComments.schema,
	'DiscussionComment',
	{
		wrap: false,
		fields: ['tenantId', 'parentId', 'content', 'commentId', 'status', 'votes', 'reported', 'voters', 'usersReported'],
	}
);


export default DiscussionCommentType;
