import { gql, graphql } from 'react-apollo';

const keywordUpdate = gql`
	mutation keywordUpdate($id: String! $keyword: KeywordInputType!) {
	keywordUpdate(keywordId: $id keyword: $keyword) {
		_id
	}
}
 `;

const keywordUpdateMutation = graphql(keywordUpdate, {
	props: (params) => ({
		keywordUpdate: (id, keyword) => params.keywordUpdateMutation({variables: {id, keyword}}),
	}),
	name: 'keywordUpdateMutation',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});
export default keywordUpdateMutation;