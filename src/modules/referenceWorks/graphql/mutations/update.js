import { gql, graphql } from 'react-apollo';

const referenceWorkUpdate = gql`
	mutation referenceWorkUpdate($_id: String! $referenceWork: ReferenceWorkInputType!) {
	referenceWorkUpdate(referenceWorkId: $_id referenceWork: $referenceWork) {
		_id
	}
}
 `;

const referenceWorkUpdateMutation = graphql(referenceWorkUpdate, {
	props: (params) => ({
		referenceWorkUpdate: (_id, referenceWork) => params.referenceWorkUpdateMutation({variables: {_id, referenceWork}}),
	}),
	name: 'referenceWorkUpdateMutation',
	options: {
		refetchQueries: ['referenceWorksQuery']
	}
});

export default referenceWorkUpdateMutation;
