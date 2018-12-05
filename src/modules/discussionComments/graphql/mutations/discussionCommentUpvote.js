import { gql, graphql } from 'react-apollo';

const discussionCommentUpvote = gql`
	mutation discussionCommentUpvote($id: String!) {
	discussionCommentUpvote(discussionCommentId: $id) {
		_id
	}
}
`;

const discussionCommentUpvoteMutation = graphql(discussionCommentUpvote, {
	props: (params) => ({
		discussionCommentUpvote: (id) => params.discussionCommentUpvoteMutation({variables: {id}}),
	}),
	name: 'discussionCommentUpvoteMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});


export default discussionCommentUpvoteMutation;
