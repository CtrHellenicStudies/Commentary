// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// models:
import Commenters from '/imports/models/commenters';

// tested module:
import { commentersInsert, commentersUpdate, commentersRemove } from './commenters';


describe('Commenters methods API', () => {
	describe('commenters.insert', () => {
		[
			{
				token: faker.random.uuid(),
				commenter: {
					name: faker.name.firstName(),
					slug: faker.helpers.slugify(faker.name.firstName()),
					tenantId: faker.random.uuid(),
				}
			}
		].forEach((testCase, index) => {

			const { token, commenter } = testCase;

			const commenterkId = faker.random.uuid();

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

					Commenters.insert = () => {};
					stub(Commenters, 'insert').callsFake(() => commenterkId);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Commenters.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(commentersInsert.bind(null, token, commenter)).toThrow();
				});

				test('successful commenter insert', () => {

					expect(commentersInsert(token, commenter)).toBe(commenterkId);
				});
			});
		});
	});

	describe('commenters.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				commenter: {
					name: faker.name.firstName(),
					slug: faker.helpers.slugify(faker.name.firstName()),
					tenantId: faker.random.uuid(),
				}
			}
		].forEach((testCase, index) => {

			const { token, _id, commenter } = testCase;

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

					Commenters.update = () => {};
					stub(Commenters, 'update').callsFake(() => 1);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Commenters.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(commentersUpdate.bind(null, token, _id, commenter)).toThrow();
				});

				test('successful commenter update', () => {

					expect(commentersUpdate(token, _id, commenter)).toBe(1);
				});
			});
		});
	});

	describe('commenters.remove', () => {
		[
			{
				token: faker.random.uuid(),
				commenterId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, commenterId } = testCase;

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

					Commenters.remove = () => {};
					stub(Commenters, 'remove').callsFake(() => 1);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Commenters.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(commentersRemove.bind(null, token, commenterId)).toThrow();
				});

				test('successful commenter remove', () => {

					expect(commentersRemove(token, commenterId)).toBe(1);
				});
			});
		});
	});
});
