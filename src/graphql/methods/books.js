import { gql, graphql } from 'react-apollo';

const query = gql`
query booksQuery {
  books {
	  _id
	  title
	  slug
	  author
	  chapters
	  coverImage
	  year
	  publisher
	  citation
	  tenantId
  }
}
`;

const booksQuery = graphql(query, {
	name: 'booksQuery'
});
export { booksQuery };
