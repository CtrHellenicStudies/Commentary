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
	options: () => {
		return ({
			variables: {
				tenantId: sessionStorage.getItem('tenantId')
			}
		});
	}
});

export default referenceWorksQuery;
