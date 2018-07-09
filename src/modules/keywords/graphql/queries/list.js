import { gql, graphql } from 'react-apollo';

const query = gql`
query keywordsQuery($tenantId: ID $queryParam: String) {
	keywords (tenantId: $tenantId queryParam: $queryParam) {
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


const keywordsQuery = graphql(query, {
	name: 'keywordsQuery',
});

export default keywordsQuery;
