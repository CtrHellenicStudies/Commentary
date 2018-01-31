import { gql, graphql } from 'react-apollo';

const query = gql`
	query settingListItemQuery($collectionId: Int, $settingGroupUrn: String, $workUrn: String) {
		collection(id: $collectionId) {
	    id
			settingGroup(urn: $settingGroupUrn) {
				id
				work(urn: $workUrn) {
					id
					english_title
				}
			}
		}
	}
`;

const settingListItemQuery = graphql(query, {
	name: 'settingListItemQuery',
	options: (props) => ({
		variables: {
			collectionId: parseInt(props.ctsNamespace, 10),
			settingGroupUrn: props.settingGroup,
			workUrn: props.work,
		}
	}),
});

export default settingListItemQuery;
