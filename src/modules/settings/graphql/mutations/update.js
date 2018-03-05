import { gql, graphql } from 'react-apollo';


const settingsUpdate = gql`
	mutation settingsUpdate($_id: String! $settings: SettingsInputType!) {
	settingsUpdate(settingsId: $_id settings: $settings) {
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
		settingsUpdate: (_id, settings) => params.settingsUpdateMutation({variables: {_id, settings}}),
	}),
	name: 'settingsUpdateMutation',
	options: {
		refetchQueries: ['settingsQuery']
	}
});

export default settingsUpdateMutation;
