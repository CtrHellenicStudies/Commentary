import { gql, graphql } from 'react-apollo';

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

const textNodesQuery = graphql(query, {
	name: 'textNodesQuery',
});

export default textNodesQuery;
