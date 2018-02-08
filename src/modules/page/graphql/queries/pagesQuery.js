import { gql, graphql } from 'react-apollo';

const queryById = gql`
query pagesQueryById($id: String!) {
  pages(_id: $id) {
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

const query = gql`
query pagesQuery {
  pages {
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
const pagesQuery = graphql(query, {
	name: 'pagesQuery'
});

const pagesQueryById = graphql(queryById, {
	options: ({params}) => {
		return ({
			variables: {
				id: params.id
			},
		});
	},
	name: 'pagesQueryById'
});

export default pagesQuery;
