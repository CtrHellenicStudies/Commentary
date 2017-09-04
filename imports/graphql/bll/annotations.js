import { Meteor } from 'meteor/meteor';

import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

export default class AnnotationService {
	constructor(props) {
		this.token = props.token;
		this.user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(props.token),
		});
	}

	hasAnnotationPermission(chapterUrl) {
		const book = Books.findOne({'chapters.url': chapterUrl});
		const authorizedBooks = this.user.canAnnotateBooks || [];
		return !!(this.user && (book || ~authorizedBooks.indexOf(book._id)));
	}

	hasAnnotationRevisionPermission(annotationId) {
		const comment = Comments.findOne({_id: annotationId, users: this.user._id});
		return !!comment;
	}

	rewriteRevision(revision) {
		if (revision instanceof Array) {
			const newRevision = [];
			revision.map(singleRevision => {
				newRevision.push({
					tenantId: singleRevision.tenantId,
					text: singleRevision.text,
					created: new Date(),
					updated: new Date()
				});
			});
			return newRevision;
		}
		return {
			tenantId: revision.tenantId,
			text: revision.text,
			created: new Date(),
			updated: new Date()
		};
	}

	createAnnotation(annotation) {
		const newAnnotation = annotation;
		newAnnotation.revisions = this.rewriteRevision(annotation.revisions);

		if (this.hasAnnotationPermission(annotation.bookChapterUrl)) {
			const commentId = Comments.insert({...newAnnotation});
			return Comments.findOne(commentId);
		}
		return new Error('Not authorized');
	}

	deleteAnnotation(annotationId) {
		const annotation = Comments.findOne(annotationId);
		if (this.hasAnnotationPermission(annotation.bookChapterUrl)) {
			return Comments.remove({_id: annotationId});
		}
		return new Error('Not authorized');
	}

	addRevision(annotationId, revision) {
		const newRevision = this.rewriteRevision(revision);
		if (this.hasAnnotationRevisionPermission(annotationId)) {
			return Comments.update({_id: annotationId}, {
				$addToSet: {
					revisions: newRevision
				}
			});
		}
		return new Error('Not authorized');
	}
}