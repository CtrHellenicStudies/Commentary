import { gql, graphql } from 'react-apollo';

const query = gql`
query usersQuery ($tenantId: String) {
	users (tenantId: $tenantId) {
		_id
        username
	}
}
`;
const usersQuery = graphql(query, {
	name: 'usersQuery',
	options: () => {
		return ({
			variables: {
				tenantId: sessionStorage.getItem('tenantId')
			}
		});
	}
});
export { usersQuery };
