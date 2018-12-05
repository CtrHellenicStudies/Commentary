import { gql, graphql } from 'react-apollo';

const textNodeUpdate = gql`
	mutation textNodeUpdate($_id: String! $editionId: String! $updatedText: String! $updatedTextN: Int) {
	textNodeUpdate(id: $_id editionId: $editionId updatedText: $updatedText updatedTextN: $updatedTextN) {
		_id
	}
}
 `;

const textNodeUpdateMutation = graphql(textNodeUpdate, {
	props: (params) => ({
		textNodeUpdate: (_id, editionId, updatedText, updatedTextN) =>
			params.textNodeUpdateMutation({variables: {id: _id, editionId: editionId, updatedText: updatedText, updatedTextN: updatedTextN}}),
	}),
	name: 'textNodeUpdateMutation',
	options: {
		refetchQueries: ['textNodesQuery']
	}
});
export default textNodeUpdateMutation;