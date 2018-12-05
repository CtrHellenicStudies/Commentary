import { gql, graphql } from 'react-apollo';

const query = gql`
query editionsQuery($workUrn: CtsUrn) {
	works(urn: $workUrn) {
	  slug
	  english_title
	  urn
	  id
		version {
			id
			title
			slug
		}
		exemplar {
			id
			title
			slug
		}
		translation {
			id
			title
			slug
		}
		refsDecls {
			id
			label
			slug
			description
			match_pattern
			replacement_pattern
			structure_index
			urn
		}
	}
}
`;
const editionsRemove = gql`
mutation editionsRemove($edition: EditionsInputType!, $multiline: String!)  {
    editionsRemove(edition: $edition multiline: $multiline){
        _id
    }
}
`;
const editionsInsert = gql`
mutation editionsInsert($edition: EditionsInputType!, $multiline: String!) {
  editionsInsert(edition: $edition multiline: $multiline) {
      _id
    }
}
`;
const editionsInsertMutation = graphql(editionsInsert, {
	props: (params) => ({
		editionsInsert: (edition, multiline) => params.editionsInsertMutation({variables: {edition, multiline}})
	}),
	name: 'editionsInsertMutation',
	options: {
		refetchQueries: ['editionsQuery']
	}
});
const editionsRemoveMutation = graphql(editionsRemove, {
	props: (params) => ({
		editionsRemove: (id) => params.editionsRemoveMutation({variables: {id}}),
	}),
	name: 'editionsRemoveMutation',
	options: {
		refetchQueries: ['editionsQuery']
	}
});
const editionsQuery = graphql(query, {
	name: 'editionsQuery'
});
export {
	editionsQuery,
	editionsRemoveMutation,
	editionsInsertMutation
};
