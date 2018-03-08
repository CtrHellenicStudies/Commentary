import { gql, graphql } from 'react-apollo';

import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';


const query = gql`
	query userIsAdminQuery($subdomain: String) {
		tenantBySubdomain(subdomain: $hostname) {
			_id
			userIsAdmin
		}
	}
`;

const userIsAdminQuery = graphql(query, {
	name: 'userIsAdminQuery',
	options: ({ params }) => ({
		variables: {
			subdomain: getCurrentSubdomain(),
		},
	}),
});

export default userIsAdminQuery;
