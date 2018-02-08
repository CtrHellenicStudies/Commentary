import { gql, graphql } from 'react-apollo';

const commenterRemove = gql`
	mutation commenterRemove($id: String!) {
		commenterRemove(commenterId: $id) {
		_id
	}
}
 `;

const commeterRemoveMutation = graphql(commenterRemove, {
	props: (params) => ({
		commenterRemove: (id) => params.commeterRemoveMutation({variables: {id}}),
	}),
	name: 'commeterRemoveMutation',
	options: {
		refetchQueries: ['commenters']
	}
});


export default commeterRemoveMutation;
