import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import CommentType, {CommentInputType} from '/imports/graphql/types/models/comment';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

// errors
import { AuthenticationError } from '/imports/errors';

function hasAnnotationPermission(token, chapterUrl) {
	const user = Meteor.users.findOne({
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	});

	const book = Books.findOne({ 'chapters.url': chapterUrl });
	const authorizedBooks = user.canAnnotateBooks || [];
	return user && (book || ~authorizedBooks.indexOf(book._id))
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
		resolve(parent, { comment }, token2) {

			const token = 'testtoken'; // TODO: change that to the actual token

			// workaround to store revisions, caused probably by simple-schema

			const revisions = comment.revisions;
			comment.revisions = [];
			revisions.map(revision => {
				comment.revisions.push({
					tenantId: revision.tenantId,
					text: revision.text,
					created: new Date(),
					updated: new Date()
				});
			});

			if (hasAnnotationPermission(token, comment.bookChapterUrl)) {
				const commentId = Comments.insert({...comment});
				return Comments.findOne(commentId);
			}

			throw AuthenticationError();
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
		async resolve(parent, { annotationId }, token2) {
			const token = 'testtoken'; // TODO: change that to the actual token

			const annotation = Comments.findOne(annotationId);
			if (hasAnnotationPermission(token, annotation.bookChapterUrl)) {
				return await Comments.remove({_id: annotationId});
			}
		}
	}
};

export default annotationMutationFields;
