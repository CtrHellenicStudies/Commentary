import { GraphQLID, GraphQLString, GraphQLList } from 'graphql';

// types
import { BookType } from '/imports/graphql/types/models/book';

// logic
import BookService from '../logic/books';

const bookQueryFields = {
	books: {
		type: new GraphQLList(BookType),
		description: 'Get list of all books',
		args: {
			bookId: {
				type: GraphQLID,
			},
			chapterUrl: {
				type: GraphQLString
			}
		},
		async resolve(parent, { bookId, chapterUrl }, {token}) {
			const bookService = new BookService({token});
			return await bookService.booksGet(bookId, chapterUrl);
		}
	},
	bookByChapter: {
		type: BookType,
		description: 'Get a book by the chapterUrl',
		args: {
			chapterUrl: {
				type: GraphQLString
			}
		},
		async resolve(parent, { chapterUrl }, { token }) {
			const bookService = new BookService({token});
			return await bookService.bookByChapter(chapterUrl);
		}
	},
};


export default bookQueryFields;
