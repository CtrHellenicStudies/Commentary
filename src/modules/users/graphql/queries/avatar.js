import { gql, graphql } from 'react-apollo';

const query = gql`
	query userAvatarQuery {
		getAuthedUser {
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
