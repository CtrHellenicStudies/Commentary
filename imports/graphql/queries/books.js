import { GraphQLID, GraphQLString, GraphQLList } from 'graphql';

// types
import { BookType } from '/imports/graphql/types/models/book';

// bll
import BookService from '../bll/books';

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
};


export default bookQueryFields;
