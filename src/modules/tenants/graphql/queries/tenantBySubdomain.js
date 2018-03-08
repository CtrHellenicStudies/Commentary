import { gql, graphql } from 'react-apollo';

import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';

const query = gql`
	query tenantBySubdomainQuery($subdomain: String) {
    tenantBySubdomain(subdomain: $subdomain) {
      _id
      subdomain
      isAnnotation
      settings {
        _id
        name
        domain
        title
        subtitle
        footer
        emails
        tenantId
        webhooksToken
        aboutURL
        homepageCover
        homepageIntroductionImage
        homepageIntroductionImageCaption
        discussionCommentsDisabled
      }
    }
	}
`;

const tenantBySubdomainQuery = graphql(query, {
	name: 'tenantQuery',
	options: ({ params }) => ({
		variables: {
			subdomain: getCurrentSubdomain(),
		}
	}),
});

export default tenantBySubdomainQuery;
