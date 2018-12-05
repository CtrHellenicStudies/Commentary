import { gql, graphql } from 'react-apollo';

const query = gql`
query settingsQuery {
  settings {
  _id
  name
  domain
  title
  subtitle
  footer
  emails
  introBlocks {
	  title
	  text
	  linkURL
	  linkText
  }
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

const settingsQuery = graphql(query, {
	name: 'settingsQuery'
});

export default settingsQuery;
