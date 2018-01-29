import { gql, graphql } from 'react-apollo';

import getCurrentProjectHostname from '../../../../lib/getCurrentProjectHostname';


const settingRemove = gql`
	mutation settingRemove($id: String!, $hostname: String!) {
	settingRemove(_id: $id, hostname: $hostname) {
		result
	}
}
`;

const settingRemoveMutation = graphql(settingRemove, {
	props: params => ({
		settingRemove: id => params.settingRemoveMutation({
			variables: {
				id,
				hostname: getCurrentProjectHostname(),
			},
		}),
	}),
	name: 'settingRemoveMutation',
	options: {
		refetchQueries: ['settingListQuery', 'settingQuery'],
	},
});

export default settingRemoveMutation;
