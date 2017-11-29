import { gql, graphql } from 'react-apollo';

const query = gql`
query translationsQuery ($tenantId: ID) {
    translations (tenantId: $tenantId) {
        tenantId
        author
        work
        subwork
        n
        text
    }
}
`;

const translationsQuery = graphql(query, {
	name: 'translationsQuery'
});
export { translationsQuery };
