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
const queryBySubdomain = gql`
query tenantsBySubdomainQuery($subdomain: String){
    tenantBySubdomain(subdomain: $subdomain) {
        _id
        subdomain
        isAnnotation
    }
}
`;
const tenantsQuery = graphql(query, {
	name: 'tenantsQuery'
});
const tenantsBySubdomainQuery = graphql(queryBySubdomain, {
	name: 'tenantsBySubdomainQuery'
});
export { tenantsQuery,
    tenantsBySubdomainQuery
};
