import { gql, graphql } from 'react-apollo';

const query = gql`
	query pageQuery($slug: String) {
		page(slug: $slug) {
      _id
      title
      subtitle
      headerImage
      slug
      byline
      tenantId
      content
		}
	}
`;

const pageQuery = graphql(query, {
	name: 'pageQuery',
	options: ({ match }) => ({
		variables: {
			slug: match.params.slug,
		},
	}),
});

export default pageQuery;
