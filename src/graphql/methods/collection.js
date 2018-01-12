import { gql, graphql } from 'react-apollo';


const query = gql`
	query collectionQuery($urn: String $start: Int) {
    work(urn: $urn) {
      id
      urn
      language {
        id
        title
      }
      textNodes(startsAtIndex: $start) {
        id
        urn
        location
        text
      }
    }
	}
`;

const collectionQuery = graphql(query, {
	name: 'collectionQuery',
});

export default collectionQuery;
