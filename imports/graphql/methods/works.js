import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery ($tenantId: ID) {
	works (tenantId: $tenantId) {
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
      commentHeatmap
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
