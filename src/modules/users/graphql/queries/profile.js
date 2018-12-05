import { gql, graphql } from 'react-apollo';

const query = gql`
	query userProfileQuery {
		userProfile {
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

const userProfileQuery = graphql(query, {
	name: 'userProfileQuery',
});

export default userProfileQuery;
