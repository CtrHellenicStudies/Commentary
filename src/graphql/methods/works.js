import { gql, graphql } from 'react-apollo';

const query = gql`
query worksQuery {
		collections(urn: "urn:cts:greekLit") {
			id
			title
			urn
			textGroups(urn: "urn:cts:greekLit:tlg0013") {
				id
				title
				urn
				works(language: "greek") {
					id
					original_title
					english_title
					urn
					slug
				}
			}
		}
}
`;
const subworks = gql`
query subworksQuery{
  worksAhcip {
		slug
		title
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
});
const subworksQuery = graphql(subworks, {
	name: 'subworksQuery',
});
export { worksQuery, subworksQuery };
