import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { Meteor } from 'meteor/meteor';
// types
import CommentType, { CommentInputType } from '/imports/graphql/types/models/comment';
import { RemoveType } from '/imports/graphql/types/index';
import { RevisionInputType } from '/imports/graphql/types/models/revision';

// models
import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

// errors
import { AuthenticationError } from '/imports/errors';

// logic
import AnnotationService from '../logic/annotations';

const annotationMutationFields = {
	annotationCreate: {
		type: CommentType,
		description: 'Create new annotation',
		args: {
			annotation: {
				type: CommentInputType
			}
		},
		async resolve(parent, { annotation }, {token}) {
			const annotationService = new AnnotationService({token});
			return await annotationService.createAnnotation(annotation);
		}
	},
	annotationRemove: {
		type: RemoveType,
		description: 'Remove annotation',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { id }, {token}) {

			const annotationService = new AnnotationService({token});
			return await annotationService.deleteAnnotation(id);
		}
	},
	annotationAddRevision: {
		type: CommentType,
		description: 'Add annotation revision',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			},
			revision: {
				type: new GraphQLNonNull(RevisionInputType)
			}
		},
		async resolve(parent, {id, revision}, {token}) {
			const annotationService = new AnnotationService({token});
			return await annotationService.addRevision(id, revision);
		}
	}
};

export default annotationMutationFields;
