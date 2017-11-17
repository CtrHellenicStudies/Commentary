// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// models:
import LinkedDataSchemas from '/imports/models/linkedDataSchemas';

// tested module:
import { linkedDataSchemasInsert, linkedDataSchemasUpdate, linkedDataSchemasRemove } from './linkedDataSchemas';

describe('LinkedDataSchemas methods API', () => {

	describe('linkedDataSchemas.insert', () => {
		[
			{
				token: faker.random.uuid(),
				linkedDataSchema: {
					collectionName: faker.lorem.word(),
				},
			}
		].forEach((testCase, index) => {

			const { token, linkedDataSchema } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const linkedDataSchemasId = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];
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

					LinkedDataSchemas.insert = () => {};
					stub(LinkedDataSchemas, 'insert').callsFake(() => linkedDataSchemasId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					LinkedDataSchemas.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(linkedDataSchemasInsert.bind(null, token, linkedDataSchema)).toThrow();
				});

				test('successful LinkedDataSchemas insert', () => {

					expect(linkedDataSchemasInsert(token, linkedDataSchema)).toEqual(linkedDataSchemasId);
				});
			});
		});
	});

	describe('linkedDataSchemas.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				linkedDataSchema: {
					collectionName: faker.lorem.word(),
				},
			}
		].forEach((testCase, index) => {

			const { token, linkedDataSchema } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];
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

					LinkedDataSchemas.update = () => {};
					stub(LinkedDataSchemas, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					LinkedDataSchemas.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(linkedDataSchemasUpdate.bind(null, token, linkedDataSchema)).toThrow();
				});

				test('successful LinkedDataSchemas update', () => {

					expect(linkedDataSchemasUpdate(token, linkedDataSchema)).toEqual(1);
				});
			});
		});
	});

	describe('linkedDataSchemas.remove', () => {
		[
			{
				token: faker.random.uuid(),
				linkedDataSchemaId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, linkedDataSchemaId } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];
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

					LinkedDataSchemas.remove = () => {};
					stub(LinkedDataSchemas, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					LinkedDataSchemas.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(linkedDataSchemasRemove.bind(null, token, linkedDataSchemaId)).toThrow();
				});

				test('successful LinkedDataSchemas remove', () => {

					expect(linkedDataSchemasRemove(token, linkedDataSchemaId)).toEqual(1);
				});
			});
		});
	});
});
