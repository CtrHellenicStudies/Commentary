import { gql, graphql } from 'react-apollo';


const queryById = gql`
query settingsQuery($id: String!) {
  settings(_id: $id) {
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

const settingsQueryById = graphql(queryById, {
	options: ({params}) => {
		return ({
			variables: {
				id: params.id
			},
		});
	},
	name: 'settingsQueryById'
});

export default settingsQueryById;
