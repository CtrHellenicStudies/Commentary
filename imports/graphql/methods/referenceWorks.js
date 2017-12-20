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

const referenceWorkRemove = gql`
	mutation referenceWorkRemove($id: String!) {
	referenceWorkRemove(referenceWorkId: $id) {
		_id
	}
}
 `;

const referenceWorkUpdate = gql`
	mutation referenceWorkUpdate($_id: String! $referenceWork: ReferenceWorkInputType!) {
	referenceWorkUpdate(referenceWorkId: $_id referenceWork: $referenceWork) {
		_id
	}
}
 `;

const queryById = gql`
query referenceWorksQuery($id: String!) {
  referenceWorks(id: $id) {
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

const referenceWorksQuery = graphql(query, {
	name: 'referenceWorksQuery',
	options: () => {
		return ({
			variables: {
				tenantId: sessionStorage.getItem('tenantId')
			}
		});
	}
});

const referenceWorksQueryById = graphql(queryById, {
	options: ({params}) => {
		return ({
			variables: {
				id: params.id
			},
		});
	},
	name: 'referenceWorksQueryById'
});

const referenceWorkRemoveMutation = graphql(referenceWorkRemove, {
	props: (params) => ({
		referenceWorkRemove: (id) => params.referenceWorkRemoveMutation({variables: {id}}),
	}),
	name: 'referenceWorkRemoveMutation',
	options: {
		refetchQueries: ['referenceWorksQuery']
	}
});

const referenceWorkUpdateMutation = graphql(referenceWorkUpdate, {
	props: (params) => ({
		referenceWorkUpdate: (_id, referenceWork) => params.referenceWorkUpdateMutation({variables: {_id, referenceWork}}),
	}),
	name: 'referenceWorkUpdateMutation',
	options: {
		refetchQueries: ['referenceWorksQuery']
	}
});

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

export {referenceWorksQuery, referenceWorkRemoveMutation, referenceWorksQueryById, referenceWorkUpdateMutation, referenceWorkCreateMutation};
