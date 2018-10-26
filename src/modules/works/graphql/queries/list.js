import { gql, graphql } from 'react-apollo';

const query = gql`
	query worksQuery {
		works(language: "greek") {
			id
			original_title
			english_title
			urn
			slug
		}
	}
`;

const worksQuery = graphql(query, {
	name: 'worksQuery',
	options: ({ urn }) => ({
		variables: {
			urn,
		},
	}),
});

export default worksQuery;
