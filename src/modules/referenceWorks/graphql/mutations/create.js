import { gql, graphql } from 'react-apollo';

const query = gql`
query referenceWorksQuery {
  referenceWorks {
  	_id
    title
    slug
    tenantId
    link
    authors
    coverImage
    date
    urnCode
    description
    citation
  }
}
`;
const referenceWorkCreate = gql`
mutation referenceWorkCreate($referenceWork: ReferenceWorkInputType!) {
	referenceWorkCreate(referenceWork: $referenceWork) {
    _id
    title
    slug
    tenantId
    link
    authors
    coverImage
    date
    urnCode
    description
    citation
	}
}
 `;

const referenceWorkCreateMutation = graphql(referenceWorkCreate, {
	props: (params) => ({
		referenceWorkCreate: referenceWork => params.referenceWorkCreateMutation({variables: {referenceWork}}),
	}),
	name: 'referenceWorkCreateMutation',
	options: {
		refetchQueries: ['referenceWorksQuery'],
		update: (dataStore, submittedData) => {
			const data = dataStore.readQuery({query: query});
			data.referenceWorks.push(submittedData.data.referenceWorkCreate);
			dataStore.writeQuery({query: query, data});
		}
	}
});

export default referenceWorkCreateMutation;
