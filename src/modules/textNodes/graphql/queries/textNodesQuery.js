import { gql, graphql } from 'react-apollo';

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
// _id, editionId, updatedText, updatedTextN)

const textNodesQuery = graphql(query, {
	name: 'textNodesQuery',
	options: {
		refetchQueries: ['textNodesQuery']
	}
});

export default textNodesQuery;
