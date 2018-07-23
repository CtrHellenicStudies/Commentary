import { gql, graphql } from 'react-apollo';

const query = gql`
query commenters ($tenantId: String) {
	commenters (tenantId: $tenantId) {
		_id
		avatar {
			src
		}
		name
		slug
		tenantId
		bio
		featureOnHomepage
		nCommentsTotal
		tagline
	}
}`;

const commentersQuery = graphql(query, {
	name: 'commentersQuery',
	options: ({ tenantId }) => ({
		variables: {
			tenantId,
		}
	}),
});



export default commentersQuery;
