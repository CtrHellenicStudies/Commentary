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

	createAnnotation(annotation) {
		if (this.hasAnnotationPermission(annotation.bookChapterUrl) || this.userIsAdmin) {
			const commentId = Comments.insert({ ...annotation });
			return Comments.findOne(commentId);
		}

		return new Error('Not authorized to create annotation');
	}

	deleteAnnotation(_id) {
		const annotation = Comments.findOne({ _id });
		if (this.hasAnnotationPermission(annotation.bookChapterUrl) || this.userIsAdmin) {
			return Comments.remove({ _id });
		}
		return new Error('Not authorized to delete annotation');
	}

	addRevision(_id, revision) {
		if (this.hasAnnotationRevisionPermission(_id) || this.userIsAdmin) {
			const newRevision = {
				title: revision.title,
				text: revision.text,
				created: new Date(),
			};

			return Comments.update({ _id }, {
				$addToSet: {
					revisions: newRevision,
				},
			});
		}
		return new Error('Not authorized to add revision to annotation');
	}
}
