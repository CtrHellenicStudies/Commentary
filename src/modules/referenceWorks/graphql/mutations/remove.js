import { gql, graphql } from 'react-apollo';

const referenceWorkRemove = gql`
	mutation referenceWorkRemove($id: String!) {
	referenceWorkRemove(referenceWorkId: $id) {
		_id
	}
}
 `;

const referenceWorkRemoveMutation = graphql(referenceWorkRemove, {
	props: (params) => ({
		referenceWorkRemove: (id) => params.referenceWorkRemoveMutation({variables: {id}}),
	}),
	name: 'referenceWorkRemoveMutation',
	options: {
		refetchQueries: ['referenceWorksQuery']
	}
});

export default referenceWorkRemoveMutation;
