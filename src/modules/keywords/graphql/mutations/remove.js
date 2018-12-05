import { gql, graphql } from 'react-apollo';

const keywordRemove = gql`
	mutation keywordRemove($id: String!) {
	keywordRemove(keywordId: $id) {
		_id
	}
}
 `;


const keywordRemoveMutation = graphql(keywordRemove, {
	props: (params) => ({
		keywordRemove: (id) => params.keywordRemoveMutation({variables: {id}}),
	}),
	name: 'keywordRemoveMutation',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

export default keywordRemoveMutation;