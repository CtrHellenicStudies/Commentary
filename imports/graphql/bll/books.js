import Books from '/imports/models/books';
import AdminService from './adminService';

export default class BookService extends AdminService {
	constructor(props) {
		super(props);
	}

	rewriteChapter(chapter) {
		if (chapter instanceof Array) {
			const newChapter = [];
			chapter.map(singleChapter => {
				newChapter.push({
					title: singleChapter.title,
					slug: singleChapter.slug,
					url: singleChapter.url,
					n: singleChapter.n
				});
			});
			return newChapter;
		}
		return {
			title: chapter.title,
			slug: chapter.slug,
			url: chapter.url,
			n: chapter.n
		};
	}

	bookInsert(book) {
		if (this.userIsAdmin) {
			const newBook = book;
			newBook.chapters = this.rewriteChapter(book.chapters);

			const bookId = Books.insert({...newBook});
			return Books.findOne(bookId);
		}
		return new Error('Not authorized');
	}

	bookUpdate(_id, book) {
		if (this.userIsAdmin) {
			const newBook = book;
			newBook.chapters = this.rewriteChapter(book.chapters);
			Books.update({_id}, {$set: newBook});
		}
		return new Error('Not authorized');
	}

	bookRemove(_id) {
		if (this.userIsAdmin) {
			return Books.remove(_id);
		}
		return new Error('Not authorized');
	}
	booksGet(_id, chapterUrl) {
		if (this.userIsAdmin) {
			const args = {};

			if (_id) {
				args._id = _id;
			}

			if (chapterUrl) {
				args['chapters.url'] = chapterUrl;
			}

			return Books.find(args, {
				sort: {
					slug: 1,
					title: 1
				},
			}).fetch();
		}
		return new Error('Not authorized');
	}
}
