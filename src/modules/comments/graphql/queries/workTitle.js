import { gql, graphql } from 'react-apollo';

const query = gql`
query workTitleQuery($textGroupUrn: CtsUrn, $workUrn: CtsUrn) {
  textGroups(urn: $textGroupUrn) {
    id
    title
  }
	works(urn: $workUrn) {
    id
    english_title
  }
}
`;

const workTitleQuery = graphql(query, {
	name: 'workTitleQuery',
	options: ({ textGroupUrn, workUrn }) => ({
		variables: {
			textGroupUrn,
			workUrn,
		},
	}),
});

export default workTitleQuery;
