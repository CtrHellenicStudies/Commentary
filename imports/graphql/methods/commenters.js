import { gql, graphql } from 'react-apollo';

const query = gql`
query commenters ($tenantId: String) {
	commenters (tenantId: $tenantId) {
		_id
		avatar
		name
		slug
		tenantId
		bio
		featureOnHomepage
		nCommentsHymns
		nCommentsIliad
		nCommentsOdyssey
		nCommentsTotal
		nCommentsWorks
		tagline
	}
}
`;

const commenterRemove = gql`
	mutation commenterRemove($id: String!) {
		commenterRemove(commenterId: $id) {
		_id
	}
}
 `;
const commenterUpdate = gql`
 mutation commenterUpdate($id: String! $CommenterInputType: String!) {
	commenterUpdate(commenterId: $id commenter: $CommenterInputType) {
	 _id
	 commenter
 }
}
`;
const commenterInsert = gql`
mutation commenterInsert($id: String! $CommenterInputType: String!) {
	commenterInsert(commenterId: $id commenter: $CommenterInputType) {
	 _id
	 commenter
 }
}
`;
const commentersQuery = (function commentersQueryFunc() {
	return graphql(query, {
		name: 'commentersQuery',
		options: () => {
			return ({
				variables: {
					tenantId: sessionStorage.getItem('tenantId')
				}
			});
		}
	});
}());

const commenterUpdateMutation = graphql(commenterUpdate, {
	props: (params) => ({
		commenterUpdateMutation: (id, commenter) => params.commenterUpdate({variables: {id, commenter}}),
	}),
	name: 'commenterUpdate',
	options: {
		refetchQueries: ['commenters']
	}
});

const commeterRemoveMutation = graphql(commenterRemove, {
	props: (params) => ({
		commenterRemove: (id) => params.commeterRemoveMutation({variables: {id}}),
	}),
	name: 'commeterRemoveMutation',
	options: {
		refetchQueries: ['commenters']
	}
});

const commenterInsertMutation = graphql(commenterInsert, {
	props: (params) => ({
		commenterInsert: (commenterId, commenter) => params.commenterInsertMutation({variables: {commenterId, commenter}}),
	}),
	name: 'commenterInsertMutation',
	options: {
		refetchQueries: ['commenters']
	}
});

export {commentersQuery,
		commenterInsertMutation,
		commenterUpdateMutation,
		commeterRemoveMutation };
