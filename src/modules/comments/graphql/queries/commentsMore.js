import { gql, graphql } from 'react-apollo';

const queryMore = gql`
query commentsMoreQuery($queryParam: String $skip: Int $limit: Int) {
	commentsMore(queryParam: $queryParam skip: $skip limit: $limit)
}
`;

const commentsMoreQuery = graphql(queryMore, {
	name: 'commentsMoreQuery',
	options: {
		refetchQueries: ['commentsMoreQuery']
	}
});

export default commentsMoreQuery;
