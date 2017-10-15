import { GraphQLNonNull, GraphQLID } from 'graphql';
// types
import {BookType, BookInputType} from '/imports/graphql/types/models/book';
import { RemoveType } from '/imports/graphql/types/index';

// logic
import BookService from '../logic/books';

const bookMutationFields = {
	bookCreate: {
		type: BookType,
		description: 'Create new book',
		args: {
			book: {
				type: BookInputType
			}
		},
		async resolve(parent, { book }, {token}) {
			const bookService = new BookService({token});
			return await bookService.bookInsert(book);
		}
	},
	bookUpdate: {
		type: BookType,
		description: 'Update book',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLID)
			},
			book: {
				type: new GraphQLNonNull(BookInputType)
			}
		},
		async resolve(parent, { _id, book }, {token}) {
			const bookService = new BookService({token});
			return await bookService.bookUpdate(_id, book);
		}
	},
	bookRemove: {
		type: RemoveType,
		description: 'Remove book',
		args: {
			bookId: {
				type: new GraphQLNonNull(GraphQLID)
			}
		},
		async resolve(parent, { bookId }, {token}) {

			const bookService = new BookService({token});
			return await bookService.bookRemove(bookId);
		}
	},
};

export default bookMutationFields;
