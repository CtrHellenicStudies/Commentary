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
		else {
			return new Error('Not authorized');
		}
	}

	bookUpdate(_id, book) {
		if (this.userIsAdmin) {
			const newBook = book;
			newBook.chapters = this.rewriteChapter(book.chapters);
			Books.update({_id}, {$set: newBook});
		}
		else {
			return new Error('Not authorized');
		}


	}


}
