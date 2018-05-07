import { gql, graphql } from 'react-apollo';

const query = gql`
query workTitleQuery($urn: CtsUrn) {
	works(urn: $urn) {
    id
    english_title
  }
}
`;

const workTitleQuery = graphql(query, {
	name: 'workTitleQuery',
	options: {
		refetchQueries: ['workTitleQuery']
	}
});

export default workTitleQuery;
