import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';
import Commenters from '/imports/collections/commenters';
import Comments from '/imports/collections/comments';
import DiscussionComments from '/imports/collections/discussionComments';
import Keywords from '/imports/collections/keywords';
import ReferenceWorks from '/imports/collections/referenceWorks';
import TextNodes from '/imports/collections/textNodes';
import Works from '/imports/collections/works';

const commentSchema = SchemaBridge.schema(
	Comments.schema,
	'Comment',
	{
		wrap: false,
		fields: ['tenantId', 'lineFrom', 'lineTo', 'lineLetter', 'nLines', 'paragraphN', 'commentOrder', 'reference', 'referenceLink', 'referenceSection', 'referenceChapter', 'referenceTranslation', 'referenceNote', 'isAnnotation'],
	}
);
const commenterSchema = SchemaBridge.schema(
	Commenters.schema,
	'Commenter',
	{
		wrap: false,
		fields: ['tenantId', 'name', 'slug', 'avatar', 'bio', 'isAuthor', 'tagline', 'nCommentsTotal'],
	}
);
const discussionCommentSchema = SchemaBridge.schema(
	DiscussionComments.schema,
	'DiscussionComment',
	{
		wrap: false,
		fields: ['tenantId', 'parentId', 'content', 'commentId', 'status', 'votes', 'reported', 'voters', 'usersReported'],
	}
);
const keywordSchema = SchemaBridge.schema(
	Keywords.schema,
	'Keyword',
	{
		wrap: false,
		fields: ['tenantId', 'title', 'slug', 'description', 'type', 'count', 'lineFrom', 'lineTo', 'lineLetter', 'nLines'],
	}
);
const referenceWorkSchema = SchemaBridge.schema(
	ReferenceWorks.schema,
	'ReferenceWork'
);
const textNodeSchema = SchemaBridge.schema(
	TextNodes.schema,
	'TextNode',
	{
		wrap: false,
		fields: ['tenantId', 'work', 'subwork']
	}
);
const workSchema = SchemaBridge.schema(
	Works.schema,
	'Work',
	{
		wrap: false,
		fields: ['tenantId', 'title', 'slug', 'order', 'nComments'],
	}
);

export default typeDefs = [`

scalar JSON
scalar Date

${commentSchema.objects}
type Comment {
	${commentSchema.fields}
	commenters: JSON
	users: JSON
	work: JSON
	subwork: JSON
	keywords: JSON
	revisions: JSON
	discussionComments: JSON
}

${commenterSchema.objects}
type Commenter {
	${commenterSchema.fields}
	nCommentsWorks: JSON
	nCommentsKeywords: JSON
}

${discussionCommentSchema.objects}
type DiscussionComment {
	${discussionCommentSchema.fields}
	user: JSON
}

${keywordSchema.objects}
type Keyword {
	${keywordSchema.fields}
	work: JSON
	subwork: JSON
}

${referenceWorkSchema}

${textNodeSchema.objects}
type TextNode {
	${textNodeSchema.fields}
	text: JSON
	related_passages: JSON
}

${workSchema.objects}
type Work {
	${workSchema.fields}
	subworks: JSON
}

type Query {
  commenters(_id: String, name: String, slug: String): [Commenter]
  comments(_id: String): [Comment]
  discussionComments(_id: String): [DiscussionComment]
  keywords(_id: String): [Keyword]
  referenceWorks(_id: String): [ReferenceWork]
  textNodes(_id: String): [TextNode]
  works(_id: String, title: String): [Work]
}

schema {
  query: Query
}
`];
