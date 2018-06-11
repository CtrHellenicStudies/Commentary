import { gql, graphql } from 'react-apollo';

const query = gql`
query referenceWorksQuery {
  referenceWorks {
  	_id
    title
    slug
    tenantId
    link
    authors
    coverImage
    date
    urnCode
    description
    citation
  }
}
`;

const referenceWorksQuery = graphql(query, {
	name: 'referenceWorksQuery',
	options: ({ tenantId }) => ({
		variables: {
			tenantId,
		},
	}),
});

export default referenceWorksQuery;
