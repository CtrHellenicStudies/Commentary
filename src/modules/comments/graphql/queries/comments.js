import { gql, graphql } from 'react-apollo';

// lib
import getCommentsQuery from '../../lib/getCommentsQuery';

const query = gql`
query commentsQuery($queryParam: String $skip: Int $limit: Int $sortRecent: Boolean) {
	comments(queryParam: $queryParam skip: $skip limit: $limit sortRecent: $sortRecent) {
		_id
		urn {
			v2
		}
		originalDate
		status
		tenantId
		commenters {
			_id
			name
			avatar {
				src
			}
			bio
			isAuthor
			slug
		}
		users
		bookChapterUrl
		paragraphN
		nLines
		commentOrder
		parentCommentId
		referenceWorks {
			referenceWorkId
			section
			chapter
			note
			translation
		}
		keywords {
			_id
			title
			slug
			description
			descriptionRaw
			type
			count
			subwork {
				n
			}
			lineFrom
			lineTo
			lineLetter
			tenantId
			nLines
		}
		revisions {
			_id
			title
			text
			slug
			tenantId
		}
		discussionComments {
			content
			status
			votes
			parentId
			voters
			reported
			usersReported
			tenantId
		}
		isAnnotation
		discussionCommentsDisabled
		created
		lemmaCitation {
			passageFrom
			passageTo
			work
			textGroup
			ctsNamespace
		}
		updated
	}
}
`;

const commentsQuery = graphql(query, {
	name: 'commentsQuery',
	options: (params) => {
		return ({
			variables: {
				skip: params.skip,
				limit: params.limit,
				queryParam: getCommentsQuery(params.filters, sessionStorage.getItem('tenantId'), params.queryParams)
			}
		});
	}
});

export default commentsQuery;
