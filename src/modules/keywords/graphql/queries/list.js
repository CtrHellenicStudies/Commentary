import { gql, graphql } from 'react-apollo';

const query = gql`
query keywordsQuery($tenantId: ID $queryParam: String $limit: Int $skip: Int) {
	keywords (tenantId: $tenantId queryParam: $queryParam limit: $limit skip: $skip) {
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
