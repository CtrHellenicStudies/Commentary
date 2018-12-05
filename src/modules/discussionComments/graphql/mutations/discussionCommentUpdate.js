import { gql, graphql } from 'react-apollo';

const discussionCommentReport = gql`
 	mutation discussionCommentReport($id: String!) {
 	discussionCommentReport(discussionCommentId: $id) {
	 	_id
 	}
}
`;

const discussionCommentReportMutation = graphql(discussionCommentReport, {
	props: (params) => ({
		discussionCommentReport: (id) => params.discussionCommentReportMutation({variables: {id}}),
	}),
	name: 'discussionCommentReportMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export default discussionCommentReportMutation;
