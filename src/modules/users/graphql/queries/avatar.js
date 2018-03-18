import { gql, graphql } from 'react-apollo';

const query = gql`
	query userAvatarQuery {
		userProfile {
			_id
			username
			profile {
				name
				avatarUrl
			}
		}
	}
`;

const userAvatarQuery = graphql(query, {
	name: 'userAvatarQuery',
});

export default userAvatarQuery;
