import { gql, graphql } from 'react-apollo';


const settingsRemove = gql`
	mutation settingsRemove($id: String!) {
	settingsRemove(settingsId: $id) {
		_id
	}
}
 `;

const settingsRemoveMutation = graphql(settingsRemove, {
	props: (params) => ({
		settingsRemove: (id) => params.settingsRemoveMutation({variables: {id}}),
	}),
	name: 'settingsRemoveMutation',
	options: {
		refetchQueries: ['settingsQuery']
	}
});


export default settingsRemoveMutation;
