import { gql, graphql } from 'react-apollo';

const settingUpdate = gql`
	mutation settingUpdate($setting: TextInputType!) {
	settingUpdate(setting: $setting) {
		_id
	}
}
`;

const settingUpdateMutation = graphql(settingUpdate, {
	props: params => ({
		settingUpdate: (setting) => params.settingUpdateMutation({
			variables: {
				setting,
			},
		}),
	}),
	name: 'settingUpdateMutation',
	options: {
		refetchQueries: ['settingListQuery', 'settingQuery'],
	},
});


export default settingUpdateMutation;
