import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import Books from '/imports/api/collections/books';

const bookInsert = (token, book) => {
	check(token, String);
	check(book, {
		title: String,
		slug: String,
		author: Match.Maybe(String),
		chapters: Match.Maybe(Array),
		coverImage: Match.Maybe(String),
		tenantId: Match.Maybe(String),
		year: Match.Maybe(Number),
		publisher: Match.Maybe(String),
		citation: Match.Maybe(String),
	});
	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Books.insert(book);
	}
	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const bookUpdate = (token, _id, book) => {
	check(token, String);
	check(_id, String);
	check(book, {
		title: String,
		slug: String,
		author: Match.Maybe(String),
		chapters: Match.Maybe(Array),
		coverImage: Match.Maybe(String),
		tenantId: Match.Maybe(String),
		year: Match.Maybe(Number),
		publisher: Match.Maybe(String),
		citation: Match.Maybe(String),
	});

	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Books.update({
			_id
		}, {
			$set: book,
		});
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const bookRemove = (token, bookId) => {
	check(token, String);
	check(bookId, String);

	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Books.remove(bookId);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

Meteor.methods({
	'books.insert': bookInsert,

	'books.update': bookUpdate,

	'books.remove': bookRemove,
});

export { bookInsert, bookUpdate, bookRemove };
