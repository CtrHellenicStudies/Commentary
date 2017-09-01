import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import CommentType, {CommentInputType} from '/imports/graphql/types/models/comment';
import { RemoveType } from '/imports/graphql/types/index';
import { RevisionInputType } from '/imports/graphql/types/models/revision';

// models
import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

// errors
import { AuthenticationError } from '/imports/errors';

//bll
import AnnotationService from '../bll/annotations';

function hasAnnotationPermission(token, chapterUrl) {
	const user = Meteor.users.findOne({
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	});

	const book = Books.findOne({ 'chapters.url': chapterUrl });
	const authorizedBooks = user.canAnnotateBooks || [];
	return user && (book || ~authorizedBooks.indexOf(book._id));
}

function hasAnnotationRevisionPermission(token, annotationId) {
	const user = Meteor.users.findOne({
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	});
	const comment = Comments.findOne({_id: annotationId, users: user._id});
	return !!comment;
}

const annotationMutationFields = {
	annotationCreate: {
		type: CommentType,
		description: 'Create new annotation',
		args: {
			comment: {
				type: CommentInputType
			}
		},
		async resolve(parent, { comment }, {token}) {
			const annotationService = new AnnotationService({token});
			return await annotationService.createAnnotation(comment);
		}
	},
	annotationDelete: {
		type: RemoveType,
		description: 'Remove annotation',
		args: {
			annotationId: {
				type: new GraphQLNonNull(GraphQLID)
			}
		},
		async resolve(parent, { annotationId }, {token}) {

			const annotationService = new AnnotationService({token});
			return await annotationService.deleteAnnotation(annotationId);
		}
	},
	annotationAddRevision: {
		type: RemoveType,
		description: 'Remove annotation',
		args: {
			annotationId: {
				type: new GraphQLNonNull(GraphQLID)
			},
			revision: {
				type: new GraphQLNonNull(RevisionInputType)
			}
		},
		async resolve(parent, {annotationId, revision}, {token}) {
			const annotationService = new AnnotationService({token});
			return await annotationService.addRevision(annotationId, revision);
		}
	}
};

export default annotationMutationFields;
