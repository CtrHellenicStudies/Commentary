import { gql, graphql } from 'react-apollo';
import { getCommentsQuery } from './helper';

const query = gql`
query commentsQuery($queryParam: String $skip: Int $limit: Int $sortRecent: Boolean) {
	comments(queryParam: $queryParam skip: $skip limit: $limit sortRecent: $sortRecent) {
		_id
		urn {
			v2
		}
		originalDate
		status
		tenantId
		commenters {
			_id
			name
			avatar {
				src
			}
			bio
			isAuthor
			slug
		}
		users
		work {
			_id
			title
			tenantId
			slug
			subworks {
				title
				slug
				n
			}
		}
		subwork {
			title
			slug
			n
		}
		lineLetter
		bookChapterUrl
		paragraphN
		nLines
		commentOrder
		parentCommentId
		referenceWorks {
			referenceWorkId
			section
			chapter
			note
			translation
		}
		keywords {
			_id
			title
			slug
			description
			descriptionRaw
			type
			count
			subwork {
				n
			}
			lineFrom
			lineTo
			lineLetter
			tenantId
			nLines
		}
		revisions {
			_id
			title
			text
			slug
			tenantId
		}
		discussionComments {
			content
			status
			votes
			parentId
			voters
			reported
			usersReported
			tenantId
		}
		isAnnotation
		discussionCommentsDisabled
		created
		lemmaCitation {
			passageFrom
			passageTo
			work
			textGroup
			ctsNamespace
		}
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

const commentRemoveRevision = gql`
mutation commentRemoveRevision($id: String!) {
	commentRemoveRevision(id: $id) {
	_id
}
}
`;
const commentInsertRevision = gql`
mutation commentInsertRevision($id: String! $revision: RevisionInputType!) {
	commentInsertRevision(id: $id revision: $revision) {
	_id
}
}
`;
const commentsQuery = graphql(query, {
	name: 'commentsQuery',
	options: (params) => {
		return ({
			variables: {
				skip: params.skip,
				limit: params.limit,
				queryParam: getCommentsQuery(params.filters, sessionStorage.getItem('tenantId'), params.queryParams)
			}
		});
	}
});
const commentsQueryById = graphql(query, {
	name: 'commentsQueryById',
	options: (params) => {
		return ({
			variables: {
				queryParam: JSON.stringify({_id: params.match.params.commentId})
			}
		});
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
const commentAddRevisionMutation = graphql(commentInsertRevision, {
	props: (params) => ({
		commentInsertRevision: (id, revision) => params.commentAddRevisionMutation({variables: {id, revision}}),
	}),
	name: 'commentAddRevisionMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});
const commentRemoveRevisionMutation = graphql(commentRemoveRevision, {
	props: (params) => ({
		commentRemoveRevision: (id) => params.commentRemoveRevisionMutation({variables: {id}}),
	}),
	name: 'commentRemoveRevisionMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export {
	commentsQuery,
	commentsMoreQuery,
	commentRemoveMutation,
	commentsInsertMutation,
	commentsUpdateMutation,
	commentsQueryById,
	commentAddRevisionMutation,
	commentRemoveRevisionMutation
};
