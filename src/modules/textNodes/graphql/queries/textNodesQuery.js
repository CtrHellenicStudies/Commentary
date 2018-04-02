import { gql, graphql } from 'react-apollo';

// Temporarily set greek language until default language is implemented
const query = gql`
query textNodesQuery($textNodesUrn: CtsUrn!) {
	textNodes(urn: $textNodesUrn, language: "greek") {
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
