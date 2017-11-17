// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// models:
import ReferenceWorks from '/imports/models/referenceWorks';

// tested module:
import { referenceWorksInsert, referenceWorksUpdate, referenceWorksRemove } from './referenceWorks';

describe('ReferenceWorks methods API', () => {

	describe('referenceWorksInsert.insert', () => {
		[
			{
				token: faker.random.uuid(),
				referenceWork: {
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
				},
			}
		].forEach((testCase, index) => {

			const { token, referenceWork } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const referenceWorksId = faker.random.uuid();

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

					ReferenceWorks.insert = () => {};
					stub(ReferenceWorks, 'insert').callsFake(() => referenceWorksId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					ReferenceWorks.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(referenceWorksInsert.bind(null, token, referenceWork)).toThrow();
				});

				test('successful ReferenceWorks insert', () => {

					expect(referenceWorksInsert(token, referenceWork)).toEqual(referenceWorksId);
				});
			});
		});
	});

	describe('referenceWorksInsert.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				referenceWork: {
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
				},
			}
		].forEach((testCase, index) => {

			const { token, _id, referenceWork } = testCase;

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

					ReferenceWorks.update = () => {};
					stub(ReferenceWorks, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					ReferenceWorks.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(referenceWorksUpdate.bind(null, token, _id, referenceWork)).toThrow();
				});

				test('successful ReferenceWorks update', () => {

					expect(referenceWorksUpdate(token, _id, referenceWork)).toEqual(1);
				});
			});
		});
	});

	describe('referenceWorksInsert.remove', () => {
		[
			{
				token: faker.random.uuid(),
				referenceWorkId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, referenceWorkId } = testCase;

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

					ReferenceWorks.remove = () => {};
					stub(ReferenceWorks, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					ReferenceWorks.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(referenceWorksRemove.bind(null, token, referenceWorkId)).toThrow();
				});

				test('successful ReferenceWorks remove', () => {

					expect(referenceWorksRemove(token, referenceWorkId)).toEqual(1);
				});
			});
		});
	});
});
