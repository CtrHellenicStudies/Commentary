import { gql, graphql } from 'react-apollo';

const keywordInsert = gql`
 mutation keywordInsert($keyword: KeywordInputType!) {
	keywordInsert(keyword: $keyword) {
	 _id
 }
}
`;

const keywordInsertMutation = graphql(keywordInsert, {
	props: (params) => ({
		keywordInsert: (keyword) => params.keywordInsertMutation({variables: {keyword}}),
	}),
	name: 'keywordInsertMutation',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

export default keywordInsertMutation;