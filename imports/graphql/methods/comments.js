import { gql, graphql } from 'react-apollo';

const query = gql`
query commentsQuery($queryParam: String $skip: Int $limit: Int $sortRecent: Boolean) {
	comments(queryParam: $queryParam skip: $skip limit: $limit sortRecent: $sortRecent) {
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
const queryMore = gql`
query commentsMoreQuery($queryParam: String $skip: Int $limit: Int) {
	commentsMore(queryParam: $queryParam skip: $skip limit: $limit)
}
`;

const commentRemove = gql`
	mutation commentRemove($id: String!) {
	commentRemove(commentId: $id) {
		_id
	}
}
 `;
const commentInsert = gql`
	mutation commentInsert($comment: CommentInputType!) {
		commentInsert(comment: $comment) {
		_id
	}
}
`;
const commentUpdate = gql`
mutation commentUpdate($id: String! $comment: CommentInputType!) {
	commentUpdate(id: $id comment: $comment) {
	_id
}
}
`;

const commentsQuery = graphql(query, {
	name: 'commentsQuery',
	options: {
		refetchQueries: ['commentsQuery']
	}
});
const commentsMoreQuery = graphql(queryMore, {
	name: 'commentsMoreQuery',
	options: {
		refetchQueries: ['commentsMoreQuery']
	}
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
const commentsInsertMutation = graphql(commentInsert, {
	props: (params) => ({
		commentInsert: (comment) => params.commentInsertMutation({variables: {comment}}),
	}),
	name: 'commentInsertMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});
const commentsUpdateMutation = graphql(commentUpdate, {
	props: (params) => ({
		commentUpdate: (id, comment) => params.commentsUpdateMutation({variables: {id, comment}}),
	}),
	name: 'commentsUpdateMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export {
	commentsQuery,
	commentsMoreQuery,
	commentRemoveMutation,
	commentsInsertMutation,
	commentsUpdateMutation
};
