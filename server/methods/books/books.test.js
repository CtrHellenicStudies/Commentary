// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// api:
import Books from '/imports/api/collections/books';

// tested module:
import { bookInsert, bookUpdate, bookRemove } from './books';


describe('Books methods API', () => {
	describe('books.insert', () => {
		[
			{
				token: faker.random.uuid(),
				book: {
					title: faker.name.title(),
					slug: faker.helpers.slugify(faker.name.title()),
					author: faker.name.firstName(),
					chapters: faker.random.number(),
					coverImage: faker.random.uuid(),
					tenantId: faker.random.uuid(),
					year: faker.random.number(),
					publisher: faker.random.uuid(),
					citation: faker.lorem.text(),
				}
			}
		].forEach((testCase, index) => {

			const { token, book } = testCase;

			const bookId = faker.random.uuid();

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					Books.insert = () => {};
					stub(Books, 'insert').callsFake(() => bookId);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Books.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(bookInsert.bind(null, token, book)).toThrow();
				});

				test('successful book insert', () => {

					expect(bookInsert(token, book)).toBe(bookId);
				});
			});
		});
	});

	describe('books.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				book: {
					title: faker.name.title(),
					slug: faker.helpers.slugify(faker.name.title()),
					author: faker.name.firstName(),
					chapters: faker.random.number(),
					coverImage: faker.random.uuid(),
					tenantId: faker.random.uuid(),
					year: faker.random.number(),
					publisher: faker.random.uuid(),
					citation: faker.lorem.text(),
				}
			}
		].forEach((testCase, index) => {

			const { token, _id, book } = testCase;

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					Books.update = () => {};
					stub(Books, 'update').callsFake(() => 1);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Books.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(bookUpdate.bind(null, token, _id, book)).toThrow();
				});

				test('successful book update', () => {

					expect(bookUpdate(token, _id, book)).toBe(1);
				});
			});
		});
	});

	describe('books.remove', () => {
		[
			{
				token: faker.random.uuid(),
				bookId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, bookId } = testCase;

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					Books.remove = () => {};
					stub(Books, 'remove').callsFake(() => 1);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Books.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(bookRemove.bind(null, token, bookId)).toThrow();
				});

				test('successful book remove', () => {

					expect(bookRemove(token, bookId)).toBe(1);
				});
			});
		});
	});
});
