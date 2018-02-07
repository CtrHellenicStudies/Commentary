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


const keywordsQuery = graphql(query, {
	name: 'keywordsQuery',
	options: {
		refetchQueries: ['keywordsQuery']
	}
});

export {
    keywordsQuery
};
