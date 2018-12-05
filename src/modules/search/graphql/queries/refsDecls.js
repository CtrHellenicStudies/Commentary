import { gql, graphql } from 'react-apollo';

const query = gql`
	query refsDeclsQuery($urn: CtsUrn) {
    works(urn: $urn) {
      id
      urn
			refsDecls {
	      id
	      label
	      slug
	    }
		}
	}
`;

const refsDeclsQuery = graphql(query, {
	name: 'refsDeclsQuery',
	options: ({ urn }) => ({
		variables: {
			urn,
		},
	}),
});

export default refsDeclsQuery;
