import { gql, graphql } from 'react-apollo';

import getCurrentProjectHostname from '../../../../lib/getCurrentProjectHostname';

const settingCreate = gql`
mutation settingCreate($hostname: String!, $setting: TextInputType!) {
	settingCreate(hostname: $hostname, setting: $setting) {
    _id
	}
}
`;

const settingCreateMutation = graphql(settingCreate, {
	props: params => ({
		settingCreate: (setting) => params.settingCreateMutation({
			variables: {
				setting,
				hostname: getCurrentProjectHostname(),
			},
		}),
	}),
	name: 'settingCreateMutation',
	options: {
		refetchQueries: ['settingListQuery', 'settingQuery'],
	},
});

export default settingCreateMutation;
