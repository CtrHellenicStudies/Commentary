
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

${translationSchema}

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
