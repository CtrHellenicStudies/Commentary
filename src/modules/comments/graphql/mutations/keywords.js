import { gql, graphql } from 'react-apollo';

const keywordRemove = gql`
	mutation keywordRemove($id: String!) {
	keywordRemove(keywordId: $id) {
		_id
	}
}
 `;
const keywordInsert = gql`
 mutation keywordInsert($keyword: KeywordInputType!) {
	keywordInsert(keyword: $keyword) {
	 _id
 }
}
`;

const keywordUpdate = gql`
	mutation keywordUpdate($id: String! $keyword: KeywordInputType!) {
	keywordUpdate(keywordId: $id keyword: $keyword) {
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

const keywordUpdateMutation = graphql(keywordUpdate, {
	props: (params) => ({
		keywordUpdate: (id, keyword) => params.keywordUpdateMutation({variables: {id, keyword}}),
	}),
	name: 'keywordUpdateMutation',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

const keywordInsertMutation = graphql(keywordInsert, {
	props: (params) => ({
		keywordInsert: (keyword) => params.keywordInsertMutation({variables: {keyword}}),
	}),
	name: 'keywordInsertMutation',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

export {
    keywordRemoveMutation,
	keywordUpdateMutation,
	keywordInsertMutation
};
