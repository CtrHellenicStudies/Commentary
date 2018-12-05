import { gql, graphql } from 'react-apollo';


const settingsUpdate = gql`
	mutation settingsUpdate($settings: SettingsInputType!) {
		settingsUpdate(settings: $settings) {
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
		  introBlocks {
				title
				text
				linkURL
				linkText
			}
		  aboutURL
		}
	}
`;

const settingsUpdateMutation = graphql(settingsUpdate, {
	props: (params) => ({
		settingsUpdate: (settings) => params.settingsUpdateMutation({
			variables: {
				settings,
			},
		}),
	}),
	name: 'settingsUpdateMutation',
	options: {
		refetchQueries: ['settingsQuery']
	}
});

export default settingsUpdateMutation;
