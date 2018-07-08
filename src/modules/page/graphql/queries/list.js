import { gql, graphql } from 'react-apollo';

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

export default pagesQuery;
