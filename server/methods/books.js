import { Meteor } from 'meteor/meteor';
import Books from '/imports/collections/books';

Meteor.methods({
	'books.insert': (book) => {
		check(book, {
			title: String,
			slug: String,
			author: Match.Maybe(String),
			chapters: Match.Maybe(Array),
			coverImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
		});

		return Books.insert(book);
	},

	'books.update': (_id, book) => {
		check(_id, String);
		check(book, {
			title: String,
			slug: String,
			author: Match.Maybe(String),
			chapters: Match.Maybe(Array),
			coverImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
		});

		Books.update({
			_id
		}, {
			$set: book,
		});
	},

	'books.remove': (bookId) => {
		check(bookId, String);

		Books.remove(bookId);
	}
});
