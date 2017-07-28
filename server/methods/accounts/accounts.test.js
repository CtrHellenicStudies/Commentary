// meteor:
import { Meteor } from 'meteor/meteor';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// api:
import Books from '/imports/api/collections/books';
import Comments from '/imports/api/collections/comments';

// tested module:
import accountsMethods from './accounts';


describe('Accounts methods API', () => {
	describe('createAccount', () => {
		[
			{
				user: faker.helpers.userCard(),
			}
		].forEach((testCase, index) => {

			const { user } = testCase;

			describe(`Test Case ${index}`, () => {

				test(`create user, generate stampedToken and return { userId, stampedToken }`, () => {

					expect(accountsMethods.createAccount(user)).toMatchObject( { userId: 'userId', stampedToken: 'stampedToken' } );
				});
			});
		});
	});

	describe('updateAccount', () => {
		[
			{
				field: faker.lorem.word(),
				value: faker.lorem.word(),
			}, {
				field: faker.lorem.word(),
				value: [faker.helpers.createCard(), faker.helpers.createCard()]
			}
		].forEach((testCase, index) => {

			const { field, value } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor, 'userId').callsFake(() => ({}));
					stub(Meteor.users, 'update').callsFake(() => true);
				});

				afterEach(() => {
					Meteor.userId.restore();
					Meteor.users.update.restore();
				});

				test(`user is not logged in, should return error`, () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(accountsMethods.updateAccount.bind(null, field, value)).toThrow();
				});

				test(`user update fail, should return error`, () => {

					Meteor.users.update.restore();
					stub(Meteor.users, 'update').callsFake(() => {throw new Error()});

					expect(accountsMethods.updateAccount.bind(this, field, value)).toThrow();
				});

				test(`create user, generate stampedToken and return { userId, stampedToken }`, () => {

					expect(accountsMethods.updateAccount(field, value)).toBeTruthy();
				});
			});
		});
	});

	describe('deleteAccount', () => {
		[
			{
				userId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { userId } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor, 'userId').callsFake(() => userId);
					stub(Meteor.users, 'remove').callsFake(() => true);
				});

				afterEach(() => {
					Meteor.userId.restore();
					Meteor.users.remove.restore();
				});

				test(`privided userId is different than logged in userId, should return error`, () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(accountsMethods.deleteAccount.bind(null, userId)).toThrow();
				});

				test(`successful user delete`, () => {

					expect(accountsMethods.deleteAccount(userId)).toBeTruthy();
				});
			});
		});
	});

	describe('currentAdminUser', () => {
		[{}].forEach((testCase, index) => {

			const { } = testCase;

			describe(`Test Case ${index}`, () => {});
		});
	});

	describe('getNewStampedToken', () => {
		[{}].forEach((testCase, index) => {

			const {  } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor, 'userId').callsFake(() => ({}));
				});

				afterEach(() => {
					Meteor.userId.restore();
				});

				test(`user is not logged in, should return error`, () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(accountsMethods.getNewStampedToken).toThrow();
				});
			});
		});
	});
});
