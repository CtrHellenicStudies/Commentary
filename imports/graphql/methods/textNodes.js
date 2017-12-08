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
function isValue(val) {
	return val !== undefined && val !== null;
}
const textNodesQuery = graphql(query, {
	name: 'textNodesQuery',
	options: (params) => {
		console.log(params);
		if (params) {
			const workSlug = isValue(params.workSlug) ? params.workSlug : params.commentGroup.work.slug;
			const subworkN = isValue(params.subworkN) ? params.subworkN : params.commentGroup.subwork.n;
			const lineFrom = isValue(params.lineFrom) ? params.lineFrom : params.commentGroup.lineFrom;
			let lineTo = params.lineTo;
			if (params.commentGroup) {
				lineTo = isValue(params.commentGroup.lineTo) ? params.commentGroup.lineTo : lineFrom;
			} else if (!isValue(lineTo) || lineTo < lineFrom) {
				lineTo = lineFrom;
			}
			return ({
				variables: {
					tenantId: sessionStorage.getItem('tenantId'),
					workSlug: workSlug === 'homeric-hymns' ? 'hymns' : workSlug,
					subworkN: subworkN,
					lineFrom: lineFrom,
					lineTo: lineTo,
					editionId: params.editionId
				}
			});
		}
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
