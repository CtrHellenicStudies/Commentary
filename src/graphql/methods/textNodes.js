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
const getMaxLine = gql`
mutation getMaxLine($workSlug: String! $subworkN: Int!) {
	getMaxLine(workSlug: $workSlug subworkN: $subworkN)
}
`;
const queryById = gql`
query textNodesQueryById($id: ID!) {
  textNodes(id: $id) {
	  id
	  text
  }
}
`;

/*
const query = gql`
query textNodesQuery($collectionUrn: CtsUrn, $textGroupUrn: CtsUrn, $workUrn: CtsUrn, $textNodesUrn: CtsUrn, $language: String) {
	collections(urn: $collectionUrn) {
		id
		title
		urn
		textGroups(urn: $textGroupUrn) {
			id
			title
			urn
			works(language: $language, urn: $workUrn) {
				id
				original_title
				version {
					id
				}
				urn
				slug
				textNodes(urn: $textNodesUrn) {
					id
					text
					location
					urn
				}
			}
		}
	}
}
`;
*/

const query = gql`
query textNodesQuery($textNodesUrn: CtsUrn!) {
	textNodes(urn: $textNodesUrn) {
		id
		text
		location
		urn
		version {
			id
			title
			slug
		}
		translation {
			id
			title
			slug
		}
		language {
			id
			title
			slug
		}
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
	options: {
		refetchQueries: ['textNodesQuery']
	}
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

const getMaxLineMutation = graphql(getMaxLine, {
	name: 'getMaxLine',
	props: (params) => ({
		getMaxLine: (workSlug, subworkN) => params.getMaxLine({variables: {workSlug: workSlug, subworkN: subworkN}}),
	}),
});

export {
	textNodeCreateMutation,
	textNodesQueryById,
	textNodeUpdateMutation,
	textNodeRemoveMutation,
	textNodesQuery,
	getMaxLineMutation
};
