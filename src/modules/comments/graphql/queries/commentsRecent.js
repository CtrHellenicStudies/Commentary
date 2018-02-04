import { gql, graphql } from 'react-apollo';

// lib
import getCommentsQuery from '../../lib/getCommentsQuery';


const query = gql`
query commentsRecent($queryParam: String) {
	commentsRecent(queryParam: $queryParam) {
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
				queryParam: getCommentsQuery(params.filters, sessionStorage.getItem('tenantId'), params.queryParams)
			}
		});
	}
});

export default commentsRecent;
