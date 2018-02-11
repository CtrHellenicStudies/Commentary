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
}
`;
const commentersQuery = (function commentersQueryFunc() {
	return graphql(query, {
		name: 'commentersQuery',
		options: () => {
			return ({
				variables: {
					tenantId: sessionStorage.getItem('tenantId')
				}
			});
		}
	});
}());



export default commentersQuery;
