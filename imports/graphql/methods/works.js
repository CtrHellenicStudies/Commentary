import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery ($tenantId: ID) {
	worksAhcip (tenantId: $tenantId) {
		_id
		title
		tenantId
		tlgCreator
		tlg
		slug
		order
		nComments
		subworks {
			title
			slug
			n
			tlgNumber
			nComments
			commentHeatmap {
				n
				nComments
			}
		}
	}
}
`;
const worksQuery = graphql(query, {
	name: 'worksQuery',
	options: () => {
		return ({
			variables: {
				tenantId: sessionStorage.getItem('tenantId')
			}
		});
	}
});
export { worksQuery };
