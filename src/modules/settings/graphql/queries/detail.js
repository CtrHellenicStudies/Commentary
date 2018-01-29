import { gql, graphql } from 'react-apollo';

import getCurrentProjectHostname from '../../../../lib/getCurrentProjectHostname';


const query = gql`
	query settingQuery($hostname: String, $id: String) {
		project(hostname: $hostname) {
	    _id
			userIsAdmin
			setting(_id: $id) {
				_id
			  projectId
			  ctsNamespace
			  settingGroup
			  work
			}
		}
	}
`;

const settingQuery = graphql(query, {
	name: 'settingQuery',
	options: ({ params }) => ({
		variables: {
			hostname: getCurrentProjectHostname(),
		}
	}),
});

export default settingQuery;
