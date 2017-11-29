import { gql, graphql } from 'react-apollo';

const textNodeCreate = gql`
mutation textNodeCreate($textNode: TextNodeInputType!) {
	textNodeCreate(textNode: $textNode) {
		_id
	}
}
 `;
const textNodeUpdate = gql`
	mutation textNodeUpdate($_id: String! $editionId: String! $updatedText: String! $updatedTextN: Int) {
	textNodeUpdate(id: $_id editionId: $editionId updatedText: $updatedText updatedTextN: $updatedTextN) {
		_id
	}
}
 `;

const textNodeRemove = gql`
	mutation textNodeRemove($id: String!) {
	textNodeRemove(textNodeId: $id) {
		_id
	}
}
 `;

const queryById = gql`
query textNodesQueryById($id: ID!) {
  textNodes(_id: $id) {
  tenantId
  text 
  work
  subwork
  relatedPassages
  }
}
`;

const query = gql`
query textNodesQuery ($tenantId: ID $workSlug: String $subworkN: Int $lineFrom: Int
	 $lineTo: Int $skip: Int $limit: Int $editionId: String) {
  textNodes (tenantId: $tenantId workSlug: $workSlug subworkN: $subworkN
	lineFrom: $lineFrom lineTo: $lineTo skip: $skip limit: $limit editionId: $editionId) {
  _id
  tenantId
  text
  work
  subwork
  relatedPassages
  }
}
`;

const textNodeCreateMutation = graphql(textNodeCreate, {
	props: (params) => ({
		textNodeCreate: textNode => params.textNodeCreateMutation({variables: {textNode}}),
	}),
	name: 'textNodeCreateMutation'
});
// _id, editionId, updatedText, updatedTextN)
const textNodeUpdateMutation = graphql(textNodeUpdate, {
	props: (params) => ({
		textNodeUpdate: (_id, editionId, updatedText, updatedTextN) =>
		params.textNodeUpdateMutation({variables: {id: _id, editionId: editionId, updatedText: updatedText, updatedTextN: updatedTextN}}),
	}),
	name: 'textNodeUpdateMutation',
	options: {
		refetchQueries: ['textNodesQueryById']
	}
});

const textNodeRemoveMutation = graphql(textNodeRemove, {
	props: (params) => ({
		textNodeRemove: (id) => params.textNodeRemoveMutation({variables: {id: id}}),
	}),
	name: 'textNodeRemoveMutation',
	options: {
		refetchQueries: ['textNodesQuery']
	}
});

const textNodesQuery = graphql(query, {
	name: 'textNodesQuery',
});

const textNodesQueryById = graphql(queryById, {
	options: ({params}) => {
		return ({
			variables: {
				id: params.id
			},
		});
	},
	name: 'textNodesQueryById'
});

export {
	textNodeCreateMutation,
	textNodesQueryById,
	textNodeUpdateMutation,
	textNodeRemoveMutation,
	textNodesQuery
};
