import { Meteor } from 'meteor/meteor';
import Books from '/imports/collections/books';

Meteor.methods({
	'books.insert': (token, book) => {
		check(token, String);
		check(book, {
			title: String,
			slug: String,
			author: Match.Maybe(String),
			chapters: Match.Maybe(Array),
			coverImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
		});
		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Books.insert(book);
		}
		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},

	'books.update': (token, _id, book) => {
		check(token, String);
		check(_id, String);
		check(book, {
			title: String,
			slug: String,
			author: Match.Maybe(String),
			chapters: Match.Maybe(Array),
			coverImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
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
	},

	'books.remove': (token, bookId) => {
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
	}
});
