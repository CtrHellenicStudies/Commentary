import { GraphQLString, GraphQLNonNull } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import CommentType, {CommentInputType} from '/imports/graphql/types/models/comment';

// models
import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

// errors
import { AuthenticationError } from '/imports/errors';

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

			// comment.revisions[0].created = new Date();
			// comment.revisions[0].updated = new Date();

			const token = 'testtoken';
			const user = Meteor.users.findOne({
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			});

			const book = Books.findOne({ 'chapters.url': comment.bookChapterUrl });
			const authorizedBooks = user.canAnnotateBooks || [];

			if (user && (book || ~authorizedBooks.indexOf(book._id))) {
				return Comments.insert({...comment});
			}

			throw AuthenticationError();
		}
	}
};

export default annotationMutationFields;
