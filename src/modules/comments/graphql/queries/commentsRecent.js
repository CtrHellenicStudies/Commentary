import { gql, graphql } from 'react-apollo';

// lib
import getCommentsQuery from '../../lib/getCommentsQuery';


const query = gql`
query commentsRecent($queryParam: String $limit: Int $skip: Int $sortRecent: Boolean) {
	comments(queryParam: $queryParam limit: $limit skip: $skip sortRecent: $sortRecent) {
		_id
		tenantId
		commenters {
			_id
			name
			slug
		}
		revisions {
			_id
			title
			text
			slug
		}
		lemmaCitation {
			passageFrom
			passageTo
			work
			textGroup
			ctsNamespace
			subreferenceIndexFrom
			subreferenceIndexTo
		}
		updated
		created
	}
}
`;

const commentsRecent = graphql(query, {
	name: 'commentsRecent',
	options: (params) => {
		return ({
			variables: {
				queryParam: getCommentsQuery(params.filters, params.tenantId, params.queryParams),
				limit: params.limit,
				skip: params.skip,
				sortRecent: true,
			}
		});
	}
});

export default commentsRecent;
