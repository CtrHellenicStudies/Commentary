/**
 * Queries for annotations
 */

import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';

// logic
import AnnotationService from '../logic/annotations';

const annotationQueryFields = {
	annotations: {
		type: new GraphQLList(CommentType),
		description: 'Get list of annotations for a book chapter',
		args: {
			bookChapterUrl: {
				type: GraphQLString,
			}
		},
		async resolve(parent, { bookChapterUrl }, {token}) {
			const annotationService = new AnnotationService({token});
			return await annotationService.annotationsGet(bookChapterUrl);
		}
	},
};

export default annotationQueryFields;