import { gql, graphql } from 'react-apollo';

const commenterInsert = gql`
mutation commenterInsert($id: String! $CommenterInputType: String!) {
	commenterInsert(commenterId: $id commenter: $CommenterInputType) {
	 _id
	 commenter
 }
}
`;

const commenterInsertMutation = graphql(commenterInsert, {
	props: (params) => ({
		commenterInsert: (commenterId, commenter) => params.commenterInsertMutation({variables: {commenterId, commenter}}),
	}),
	name: 'commenterInsertMutation',
	options: {
		refetchQueries: ['commenters']
	}
});

export default commenterInsertMutation;
