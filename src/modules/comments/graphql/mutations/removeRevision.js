import { gql, graphql } from 'react-apollo';


const commentRemoveRevision = gql`
mutation commentRemoveRevision($id: String!) {
	commentRemoveRevision(id: $id) {
  	_id
  }
}
`;

const commentRemoveRevisionMutation = graphql(commentRemoveRevision, {
	props: (params) => ({
		commentRemoveRevision: (id) => params.commentRemoveRevisionMutation({variables: {id}}),
	}),
	name: 'commentRemoveRevisionMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export default commentRemoveRevisionMutation;
