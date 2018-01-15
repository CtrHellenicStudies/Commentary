import { gql, graphql } from 'react-apollo';


const query = gql`
	query collectionQuery($urn1: String $urn2: String $urn3: String $location: [Int]) {
    collection(urn: $urn1) {
    textGroup(urn: $urn2) {
      work(urn: $urn3) {
        id
        urn
        language {
          id
          title
        }
        textNodes(location: $location) {
          id
          urn
          location
          text
       }
      }
    }
  }
	}
`;

const collectionQuery = graphql(query, {
	name: 'collectionQuery',
});

export default collectionQuery;
