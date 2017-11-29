import { gql, graphql } from 'react-apollo';

const query = gql`
query translationsQuery ($tenantId: ID) {
    translations (tenantId: $tenantId) {
        tenantId
        author
        work
        subwork
        lineFrom
        lineTo
        nLines
        revisions
    }
}
`;

const translationsQuery = graphql(query, {
	name: 'translationsQuery'
});
export { translationsQuery };
