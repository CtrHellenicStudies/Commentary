import { gql, graphql } from 'react-apollo';

import getCurrentProjectHostname from '../../../../lib/getCurrentProjectHostname';


const query = gql`
	query settingListQuery($hostname: String) {
		project(hostname: $hostname) {
	    _id
			settings {
				_id
			  projectId
			  ctsNamespace
			  settingGroup
			  work
			}
		}
	}
`;

const settingListQuery = graphql(query, {
	name: 'settingListQuery',
	options: ({ params }) => ({
		variables: {
			hostname: getCurrentProjectHostname(),
		}
	}),
});

export default settingListQuery;
