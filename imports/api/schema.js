import SchemaBridge from 'meteor/kuip:schema-graphql-bridge';
import Comments from '/imports/collections/comments';
import Commenters from '/imports/collections/commenters';
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
	'Commentator',
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

const typeDefs = [`

scalar JSON
scalar Date

${commentSchema.objects}
type Comment {
	_id: String
	${commentSchema.fields}
	commenters: JSON
	users: JSON
	work: JSON
	subwork: JSON
	keywords: JSON
	revisions: JSON
	discussionComments: JSON
	limit: Int
	offest: Int
}

${commenterSchema.objects}
type Commentator {
	_id: String
	${commenterSchema.fields}
	nCommentsWorks: JSON
	nCommentsKeywords: JSON
}

${discussionCommentSchema.objects}
type DiscussionComment {
	_id: String
	${discussionCommentSchema.fields}
	user: JSON
	limit: Int
	offest: Int
}

${keywordSchema.objects}
type Keyword {
	_id: String
	${keywordSchema.fields}
	work: JSON
	subwork: JSON
	jsonld: JSON
}

${referenceWorkSchema}

${textNodeSchema.objects}
type TextNode {
	_id: String
	${textNodeSchema.fields}
	text: JSON
	related_passages: JSON
	limit: Int
	offest: Int
}

${workSchema.objects}
type Work {
	_id: String
	${workSchema.fields}
	subworks: JSON
}

type Query {

  commenters(_id: String, name: String, slug: String, tenantId: String, isAuthor: Boolean): [Commentator]

  comments(_id: String, commenter: String, tenantId: String, work: String, subwork: String, lineFrom: Int, lineTo: Int, lineLetter: String, paragraphN: Int, reference: String, keyword: String, isAnnotation: Boolean): [Comment]

  discussionComments(_id: String, user: String, content: String, parentId: String, commentId: String, votes: Int, voter: String): [DiscussionComment]

  keywords(_id: String, title: String, slug: String, description: String, type: String, count: Int, work: String, subwork: String, lineFrom: Int, lineTo: Int, lineLetter: String, tenantId: String, jsonld: Boolean, jsonldType: String): [Keyword]

  referenceWorks(_id: String, title: String, slug: String, tenantId: String, author: String, urnCode: String, description: String, citation: String): [ReferenceWork]

  textNodes(_id: String, tenantId: String, work: String, subwork: String, lineFrom: Int, lineTo: Int, edition: String, text: String, relatedPassageWork: String, relatedPassageSubwork: String, relatedPassageLineFrom: Int, relatedPassageLineTo: Int, relatedPassageText: String): [TextNode]

  works(_id: String, tenantId: String, title: String, slug: String): [Work]

}

schema {
  query: Query
}
`];

export default typeDefs;
