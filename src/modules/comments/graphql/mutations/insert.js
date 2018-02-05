import { gql, graphql } from 'react-apollo';

const commentInsert = gql`
	mutation commentInsert($comment: CommentInputType!) {
		commentInsert(comment: $comment) {
		_id
	}
}
`;

const commentsInsertMutation = graphql(commentInsert, {
	props: (params) => ({
		commentInsert: (comment) => params.commentInsertMutation({variables: {comment}}),
	}),
	name: 'commentInsertMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export default commentsInsertMutation;
