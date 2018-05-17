import { gql, graphql } from 'react-apollo';

const query = gql`
query tenantsQuery($id: String){
	tenants(tenantId: $id) {
	_id
	subdomain
	isAnnotation
	}
}
`;

const tenantsQuery = graphql(query, {
	name: 'tenantsQuery'
});

export default tenantsQuery;
