import { gql, graphql } from 'react-apollo';

const query = gql`
query usersQuery ($tenantId: String $id: ID) {
	users (tenantId: $tenantId id: $id) {
		_id
		username
		roles
		profile {
		  name
		  biography
		  twitter
		  facebook
		  google
		  avatarUrl
		}
		canEditCommenters
	}
}
`;

const usersQuery = graphql(query, {
	name: 'usersQuery',
});

export default usersQuery;
