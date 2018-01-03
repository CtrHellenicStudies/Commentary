import { gql, graphql } from 'react-apollo';

const query = gql`
query usersQuery ($tenantId: ID) {
	users (tenantId: $tenantId) {
        username
        name
        email
        bio
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
