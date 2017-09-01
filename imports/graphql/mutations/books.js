import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import {BookType, BookInputType} from '/imports/graphql/types/models/book';
import { RemoveType } from '/imports/graphql/types/index';

// errors
import { AuthenticationError } from '/imports/errors';

// bll
import BookService from '../bll/books';

const bookMutationFields = {
	bookCreate: {
		type: BookType,
		description: 'Create new annotation',
		args: {
			book: {
				type: BookInputType
			}
		},
		async resolve(parent, { book }, {token}) {
			const bookService = new BookService({token});
			return await bookService.bookInsert(book);
		}
	}
};

export default bookMutationFields;
