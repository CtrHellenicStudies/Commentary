// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// models:
import Works from '/imports/models/works';

// tested module:
import { worksInsert, worksUpdate, worksRemove } from './works';

describe('Works methods API', () => {

	describe('works.insert', () => {
		[
			{
				token: faker.random.uuid(),
				work: {},
			}
		].forEach((testCase, index) => {

			const { token, work } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const workId = faker.random.uuid();

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

					Works.insert = () => {};
					stub(Works, 'insert').callsFake(() => workId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Works.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(worksInsert.bind(null, token, work)).toThrow();
				});

				test('successful Works insert', () => {

					expect(worksInsert(token, work)).toEqual(workId);
				});
			});
		});
	});

	describe('works.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				work: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, work } = testCase;

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

					Works.update = () => {};
					stub(Works, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Works.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(worksUpdate.bind(null, token, _id, work)).toThrow();
				});

				test('successful Works update', () => {

					expect(worksUpdate(token, _id, work)).toEqual(1);
				});
			});
		});
	});

	describe('works.remove', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, _id } = testCase;

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

					Works.remove = () => {};
					stub(Works, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Works.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(worksRemove.bind(null, token, _id)).toThrow();
				});

				test('successful Works remove', () => {

					expect(worksRemove(token, _id)).toEqual(1);
				});
			});
		});
	});
});
