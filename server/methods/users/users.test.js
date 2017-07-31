// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// tested module:
import { usersInsert, usersUpdate, usersRemove, updatePosition } from './users';

describe('Users methods API', () => {

	describe('users.insert', () => {
		[
			{
				token: faker.random.uuid(),
				user: {
					emails: [{}],
				},
			}
		].forEach((testCase, index) => {

			const { token, user } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					stub(Accounts, 'createUser').callsFake(() => userId);

					Meteor.users.update = () => {};
					stub(Meteor.users, 'update').callsFake(() => userId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Meteor.users.update.restore();
					Accounts._hashLoginToken.restore();
					Accounts.createUser.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(usersInsert.bind(null, token, user)).toThrow();
				});

				test('successful Meteor.users insert', () => {

					expect(usersInsert(token, user)).toEqual(userId);
				});
			});
		});
	});

	describe('users.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				user: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, user } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Meteor.users.update = () => {};
					stub(Meteor.users, 'update').callsFake(() => userId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Meteor.users.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(usersUpdate.bind(null, token, _id, user)).toThrow();
				});

				test('successful Meteor.users update', () => {

					expect(usersUpdate(token, _id, user)).toEqual(userId);
				});
			});
		});
	});

	describe('users.remove', () => {
		[
			{
				token: faker.random.uuid(),
				userId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, userId } = testCase;

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

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Meteor.users.remove = () => {};
					stub(Meteor.users, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Meteor.users.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(usersRemove.bind(null, token, userId)).toThrow();
				});

				test('successful Meteor.users remove', () => {

					expect(usersRemove(token, userId)).toEqual(1);
				});
			});
		});
	});

	describe('updatePosition', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				position: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, position } = testCase;

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr._id === _id
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Meteor.users.update = () => {};
					stub(Meteor.users, 'update').callsFake(() => 1);

					stub(Meteor, 'user').callsFake(() => null);

				});

				afterEach(() => {
					Meteor.user.restore();
					Meteor.users.findOne.restore();
					Meteor.users.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(updatePosition.bind(null, token, _id, position)).toThrow();
				});

				test('successful updatePosition', () => {

					expect(updatePosition(token, _id, position)).toEqual(1);
				});
			});
		});
	});
});
