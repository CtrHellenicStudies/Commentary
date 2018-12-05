import { gql, graphql } from 'react-apollo';

const discussionCommentUnreport = gql`
	mutation discussionCommentUnreport($id: String!) {
	discussionCommentUnreport(discussionCommentId: $id) {
		_id
	}
}
`;

const discussionCommentUnreportMutation = graphql(discussionCommentUnreport, {
	props: (params) => ({
		discussionCommentUnreport: (id) => params.discussionCommentUnreportMutation({variables: {id}}),
	}),
	name: 'discussionCommentUnreportMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export default discussionCommentUnreportMutation;
