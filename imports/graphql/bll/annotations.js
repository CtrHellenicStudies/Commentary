import { Meteor } from 'meteor/meteor';

import Comments from '/imports/models/comments';
import Books from '/imports/models/books';

import AdminService from './adminService';

export default class AnnotationService extends AdminService {
	constructor(props) {
		super(props);
		if (props.token) {
			this.token = props.token;
			this.user = Meteor.users.findOne({
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(props.token),
			});
		}
	}

	annotationsGet(bookChapterUrl) {
		const args = {
			bookChapterUrl,
			isAnnotation: true,
		};

		const options = {
			sort: {
				paragraphN: 1,
			},
		};

		return Comments.find(args, options).fetch();
	}

	hasAnnotationPermission(chapterUrl) {
		const book = Books.findOne({'chapters.url': chapterUrl});
		const authorizedBooks = this.user.canAnnotateBooks || [];
		if (book) {
			return !!(this.user && ~authorizedBooks.indexOf(book._id));
		}
		return false;
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
					text: singleRevision.text,
					created: new Date(),
					updated: new Date()
				});
			});
			return newRevision;
		}
		return [{
			text: revision.text,
			created: new Date(),
			updated: new Date()
		}];
	}

	createAnnotation(annotation) {
		console.log(annotation);
		if (this.hasAnnotationPermission(annotation.bookChapterUrl) || this.userIsAdmin) {
			const commentId = Comments.insert({ ...annotation });
			return Comments.findOne(commentId);
		}

		return new Error('Not authorized to create annotation');
	}

	deleteAnnotation(annotationId) {
		const annotation = Comments.findOne(annotationId);
		if (this.hasAnnotationPermission(annotation.bookChapterUrl) || this.userIsAdmin) {
			return Comments.remove({_id: annotationId});
		}
		return new Error('Not authorized to delete annotation');
	}

	addRevision(annotationId, revision) {
		const newRevision = this.rewriteRevision(revision);
		if (this.hasAnnotationRevisionPermission(annotationId) || this.userIsAdmin) {
			return Comments.update({_id: annotationId}, {
				$addToSet: {
					revisions: newRevision
				}
			});
		}
		return new Error('Not authorized to add revision to annotation');
	}
}
