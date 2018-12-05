import { gql, graphql } from 'react-apollo';

const translationCreate = gql`
mutation translationCreate($translation: TranslationInput!) {
	translationCreate(translation: $translation) {
		urn
	}
}
`;

const translationCreateMutation = graphql(translationCreate, {
	props: (params) => ({
		translationCreate: (translation) => params.translationCreateMutation({variables: {translation: translation}}),
	}),
	name: 'translationCreateMutation',
});

export default translationCreateMutation;