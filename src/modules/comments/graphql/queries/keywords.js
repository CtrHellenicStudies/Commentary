import { gql, graphql } from 'react-apollo';

const query = gql`
query keywordsQuery($tenantId: ID $queryParam: String $slug: String) {
	keywords (tenantId: $tenantId queryParam: $queryParam slug: $slug) {
	_id
    title
    slug
    description
    descriptionRaw
	type
	lineFrom
	lineTo
    count
	work {
		title
		slug
	}
	subwork {
		title
		slug
		n
	}
    lineLetter
    nLines
    tenantId
	}
}
`;

const queryById = gql`
query keywordsQuery($id: String) {
  keywords(id: $id) {
	_id
    title
    slug
    description
    descriptionRaw
    type
    count
	work {
		title
		slug
	}
	subwork {
		title
		slug
		n
	}
    lineFrom
    lineTo
    lineLetter
    nLines
    tenantId
  }
}
`;



const keywordsQuery = graphql(query, {
	name: 'keywordsQuery',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

const keywordsQueryById = graphql(queryById, {
	name: 'keywordsQueryById'
});

export {
    keywordsQuery,
    keywordsQueryById,
};
