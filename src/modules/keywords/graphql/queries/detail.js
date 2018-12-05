import { gql, graphql } from 'react-apollo';

const query = gql`
query keywordQuery($slug: String) {
	keyword (slug: $slug) {
		_id
	  title
	  slug
	  description
	  descriptionRaw
		type
	  count
	  tenantId
	}
}
`;


const keywordQuery = graphql(query, {
	name: 'keywordQuery',
	options: ({ match }) => ({
		variables: {
			slug: match.params.slug,
		},
	}),
});

export default keywordQuery;
