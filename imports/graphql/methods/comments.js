import { gql, graphql } from 'react-apollo';

const query = gql`
query commentsQuery {
  comments {
    _id
    urn
    originalDate
    status
    tenantId
    commenters
    users
    work
    subwork
    lineFrom
    lineTo
    lineLetter
    bookChapterUrl
    paragraphN
    nLines
    commentOrder
    parentCommentId
    referenceId
    referenceWorks
    keywords
    revisions
    discussionComments
    isAnnotation
    discussionCommentsDisabled
    created
    updated
  }
}
`;

const commentRemove = gql`
	mutation commentRemove($id: String!) {
	commentRemove(commentId: $id) {
		_id
	}
}
 `;

const commentsQuery = graphql(query, {
	name: 'commentsQuery'
});

const commentRemoveMutation = graphql(commentRemove, {
	props: (params) => ({
		commentRemove: (id) => params.commentRemoveMutation({variables: {id}}),
	}),
	name: 'commentRemoveMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export {commentsQuery, commentRemoveMutation};
