import { gql, graphql } from 'react-apollo';

const commentInsertRevision = gql`
mutation commentInsertRevision($id: String! $revision: RevisionInputType!) {
	commentInsertRevision(id: $id revision: $revision) {
  	_id
  }
}
`;

const commentAddRevisionMutation = graphql(commentInsertRevision, {
	props: (params) => ({
		commentInsertRevision: (id, revision) => params.commentAddRevisionMutation({variables: {id, revision}}),
	}),
	name: 'commentAddRevisionMutation',
	options: {
		refetchQueries: ['commentsQuery']
	}
});

export default commentAddRevisionMutation;
