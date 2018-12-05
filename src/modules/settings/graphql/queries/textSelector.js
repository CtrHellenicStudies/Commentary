import { gql, graphql } from 'react-apollo';


const query = gql`
	query textSelectorQuery($collectionId: Int, $textGroupUrn: CtsUrn) {
		collections {
	    id
	    urn
	    title
	  }

		collection(id: $collectionId) {
			id
			urn
			title

			textGroups(urn: $textGroupUrn) {
				id
				urn
				title
				
				works {
					id
					urn
					english_title
				}
			}
		}
	}
`;

const textSelectorQuery = graphql(query, {
	name: 'textSelectorQuery',
	options: (props) => ({
		variables: {
			collectionId: props.collectionId,
			textGroupUrn: props.textGroupUrn,
		}
	}),
});

export default textSelectorQuery;
