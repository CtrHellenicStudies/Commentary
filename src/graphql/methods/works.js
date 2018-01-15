import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery ($collection: String $textGroup: String) {
	collection(urn: $collection) {
		textGroup(urn: $textGroup) {
		  works {
			slug
			urn
			original_title
			
		  }
		}
	}
}
`;
const subworks = gql`
query subworksQuery{
  worksAhcip {
    subworks {
      title
      slug
      n
      tlgNumber
      nComments
      commentHeatmap {
        nComments
        n
      }
    }
  }
}
`;
const worksQuery = graphql(query, {
	name: 'worksQuery',
	options: () => {
		return ({
			variables: {
				collection: "urn:cts:greekLit",
				textGroup: "urn:cts:greekLit:tlg0012"
			}
		});
	}
});
const subworksQuery = graphql(subworks, {
	name: 'subworksQuery',
});
export { worksQuery, subworksQuery };
