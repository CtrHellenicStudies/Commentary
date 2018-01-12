import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery ($collection: String $textGroup: String) {
	collection(urn: $collection) {
		textGroup(urn: $textGroup) {
		  works {
			slug
			original_title
			
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
export { worksQuery };
