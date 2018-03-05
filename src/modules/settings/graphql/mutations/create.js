import { gql, graphql } from 'react-apollo';


const settingsCreate = gql`
mutation settingsCreate($settings: SettingsInputType!) {
	settingsCreate(settings: $settings) {
		_id
		name
		domain
		title
		subtitle
		footer
		emails
		tenantId
		webhooksToken
		homepageCover
		homepageIntroduction
		homepageIntroductionImage
		homepageIntroductionImageCaption
		discussionCommentsDisabled
		aboutURL
		}
	}
`;

const settingsCreateMutation = graphql(settingsCreate, {
	props: (params) => ({
		settingsCreate: settings => params.settingsCreateMutation({variables: {settings}}),
	}),
	name: 'settingsCreateMutation',
	options: {
		refetchQueries: ['settingsQuery'],
		update: (dataStore, submittedData) => {
			const data = dataStore.readQuery({query: query});
			data.settings.push(submittedData.data.settingsCreate);
			dataStore.writeQuery({query: query, data});
		}
	}
});

export default settingsCreateMutation;
