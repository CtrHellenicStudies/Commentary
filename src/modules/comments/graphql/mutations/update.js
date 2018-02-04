import { gql, graphql } from 'react-apollo';

const commentUpdate = gql`
mutation commentUpdate($id: String! $comment: CommentInputType!) {
	commentUpdate(id: $id comment: $comment) {
	_id
}
}
`;

const commentsUpdateMutation = graphql(commentUpdate, {
	props: (params) => ({
		commentUpdate: (id, comment) => params.commentsUpdateMutation({variables: {id, comment}}),
	}),
	name: 'commentsUpdateMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export default commentsUpdateMutation;
