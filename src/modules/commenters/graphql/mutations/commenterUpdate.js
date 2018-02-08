import { gql, graphql } from 'react-apollo';

const commenterUpdate = gql`
 mutation commenterUpdate($id: String! $CommenterInputType: String!) {
	commenterUpdate(commenterId: $id commenter: $CommenterInputType) {
	 _id
	 commenter
 }
}
`;

const commenterUpdateMutation = graphql(commenterUpdate, {
	props: (params) => ({
		commenterUpdateMutation: (id, commenter) => params.commenterUpdate({variables: {id, commenter}}),
	}),
	name: 'commenterUpdate',
	options: {
		refetchQueries: ['commenters']
	}
});

export default commenterUpdateMutation;
