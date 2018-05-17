import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery {
		collections(urn: "urn:cts:greekLit") {
			id
			title
			urn
			textGroups(urn: "urn:cts:greekLit:tlg0013") {
				id
				title
				urn
				works(language: "greek") {
					id
					original_title
					english_title
					urn
					slug
				}
			}
		}
}
`;

const worksQuery = graphql(query, {
	name: 'worksQuery',
});

export { worksQuery };
