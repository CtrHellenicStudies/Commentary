import { gql, graphql } from 'react-apollo';

const query = gql`
query translationsQuery ($tenantId: ID) {
	translations (tenantId: $tenantId) {
		tenantId
		author
		work {
			_id
			title
			tenantId
			slug
			subworks {
				title
				slug
				n
			}
		}
		subwork {
			title
			slug
			n
		}
		n
		text
	}
}
`;
const queryAuthors = gql`
query translationAuthorsQuery ($selectedWork: String $selectedSubwork: String) {
	authors (selectedWork: $selectedWork selectedSubwork: $selectedSubwork) {
		author
	}
}
`;
const translationUpdate = gql`
mutation translationUpdate($translation: TranslationInputType!) {
	translationUpdate(translation: $translation) {
		text
	}
}
`;
const translationInsert = gql`
mutation translationInsert($translation: TranslationInputType!) {
	translationInsert(translation: $translation) {
		text
	}
}
`;

const translationRemove = gql`
mutation translationRemove($id: String!) {
	translationRemove(textNodeId: $id) {
		text
	}
}
`;
const translationAddAuthor = gql`
mutation translationAddAuthor($workDetails: WorkInputType! $name: String!) {
	translationAddAuthor(workDetails: $workDetails name:$name) {
		text
	}
}
`;
const translationUpdateAuthor = gql`
mutation translationUpdateAuthor($workDetails: WorkInputType! $translation: TranslationNodeInputType! $name: String!) {
	translationUpdateAuthor(workDetails: $workDetails translation: $translation name: $name) {
		text
	}
}
`;
const translationUpdateMutation = graphql(translationUpdate, {
	props: (params) => ({
		translationUpdate: (translation) => params.translationUpdateMutation({variables: {translation: translation}}),
	}),
	name: 'translationUpdateMutation',
	options: {
		refetchQueries: ['translationsQuery']
	}
});
const translationsQuery = graphql(query, {
	name: 'translationsQuery',
	options: {
		refetchQueries: ['translationsQuery']
	}
});
const translationAuthorsQuery = graphql(queryAuthors, {
	name: 'translationAuthorsQuery'
});
const translationRemoveMutation = graphql(translationRemove, {
	props: (params) => ({
		translationRemove: (id) => params.translationRemoveMutation({variables: {id: id}}),
	}),
	name: 'translationRemoveMutation',
	options: {
		refetchQueries: ['translationsQuery']
	}
});
const translationAddAuthorMutation = graphql(translationAddAuthor, {
	props: (params) => ({
		translationAddAuthor: (workSlug, name) => params.translationAddAuthorMutation({variables: {workSlug: workSlug, name: name}}),
	}),
	name: 'translationAddAuthorMutation',
	options: {
		refetchQueries: ['translationsQuery']
	}
});
const translationUpdateAuthorMutation = graphql(translationUpdateAuthor, {
	props: (params) => ({
		translationUpdateAuthor: (workSlug, translation, name) => params.translationUpdateAuthorMutation({variables: {
			workSlug: workSlug, name: name, translation: translation}}),
	}),
	name: 'translationUpdateAuthorMutation',
	options: {
		refetchQueries: ['translationsQuery']
	}
});
export {
	translationsQuery,
	translationRemoveMutation,
	translationUpdateMutation,
	translationUpdateAuthorMutation,
	translationAddAuthorMutation,
	translationAuthorsQuery
};
