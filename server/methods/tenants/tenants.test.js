// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// api:
import Tenants from '/imports/api/collections/tenants';

// tested module:
import { tenantsInsert, tenantsUpdate, tenantsRemove } from './tenants';

describe('Tenants methods API', () => {

	describe('tenants.insert', () => {
		[
			{
				token: faker.random.uuid(),
				tenant: {},
			}
		].forEach((testCase, index) => {

			const { token, tenant } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const tenantId = faker.random.uuid();

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

					Tenants.insert = () => {};
					stub(Tenants, 'insert').callsFake(() => tenantId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Tenants.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(tenantsInsert.bind(null, token, tenant)).toThrow();
				});

				test('successful Tenants insert', () => {

					expect(tenantsInsert(token, tenant)).toEqual(tenantId);
				});
			});
		});
	});

	describe('tenants.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				tenant: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, tenant } = testCase;

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

					Tenants.update = () => {};
					stub(Tenants, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Tenants.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(tenantsUpdate.bind(null, token, _id, tenant)).toThrow();
				});

				test('successful Tenants update', () => {

					expect(tenantsUpdate(token, _id, tenant)).toEqual(1);
				});
			});
		});
	});

	describe('tenants.remove', () => {
		[
			{
				token: faker.random.uuid(),
				tenantId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, tenantId } = testCase;

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

					Tenants.remove = () => {};
					stub(Tenants, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Tenants.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(tenantsRemove.bind(null, token, tenantId)).toThrow();
				});

				test('successful Tenants remove', () => {

					expect(tenantsRemove(token, tenantId)).toEqual(1);
				});
			});
		});
	});
});
