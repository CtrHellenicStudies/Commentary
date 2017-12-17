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

const settingsRemove = gql`
	mutation settingsRemove($id: String!) {
	settingsRemove(settingsId: $id) {
		_id
	}
}
 `;

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

const settingsQuery = graphql(query, {
	name: 'settingsQuery'
});

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

const settingsRemoveMutation = graphql(settingsRemove, {
	props: (params) => ({
		settingsRemove: (id) => params.settingsRemoveMutation({variables: {id}}),
	}),
	name: 'settingsRemoveMutation',
	options: {
		refetchQueries: ['settingsQuery']
	}
});

const settingsUpdateMutation = graphql(settingsUpdate, {
	props: (params) => ({
		settingsUpdate: (_id, settings) => params.settingsUpdateMutation({variables: {_id, settings}}),
	}),
	name: 'settingsUpdateMutation',
	options: {
		refetchQueries: ['settingsQuery']
	}
});

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

export { settingsQuery,
    settingsRemoveMutation,
    settingsUpdateMutation,
    settingsQueryById,
    settingsCreateMutation
};
