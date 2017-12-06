import Books from '/imports/models/books';
import GraphQLService from './graphQLService';

/**
 * Logic-layer service for dealing with books
 */
export default class BookService extends GraphQLService {

	/**
	 * Rewrite chapters for modifiying books
	 * @param {(Object|Array)} chapter
	 * @returns {(Object|Array)} the new chapter
	 */
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

	/**
	 * Create a new book
	 * @param {Object} book - a new book candidate
	 * @returns {Object} the newly created book object
	 */
	bookInsert(book) {
		if (this.userIsAdmin) {
			const newBook = book;
			newBook.chapters = this.rewriteChapter(book.chapters);

			const bookId = Books.insert({...newBook});
			return Books.findOne(bookId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a book record
	 * @param {string} _id - id of book to be updated
	 * @param {Object} book - book update parameters
	 * @returns {Object} updated book record
	 */
	bookUpdate(_id, book) {
		if (this.userIsAdmin) {
			const newBook = book;
			newBook.chapters = this.rewriteChapter(book.chapters);
			Books.update({_id}, {$set: newBook});
			return Books.findOne(_id);
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a book
	 * @param {string} _id - id of book to be updated
	 * @returns {boolean} result of the mongo orm remove
	 */
	bookRemove(_id) {
		if (this.userIsAdmin) {
			return Books.remove(_id);
		}
		return new Error('Not authorized');
	}

	/**
	 * Get a book by the supplied chapter url
	 * @param {string} chapterUrl - the URL of a chapter of the book
	 * @returns {Object} a book record
	 */
	bookByChapter(chapterUrl) {
		const args = {
			'chapters.url': chapterUrl,
		};

		return Books.findOne(args, {
			sort: {
				slug: 1,
			},
		});
	}

	/**
	 * Get a book by supplied _id or chapter url
	 * @param {string} _id - the id of the book
	 * @param {string} chapterUrl - the URL of a chapter of the book
	 * @returns {Object[]} the book records
	 */
	booksGet(_id, chapterUrl) {
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
}
