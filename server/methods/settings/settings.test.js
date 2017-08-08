// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// api:
import Settings from '/imports/api/collections/settings.js';

// tested module:
import { settingsInsert, settingsUpdate, settingsRemove } from './settings';

describe('Settings methods API', () => {

	describe('settings.insert', () => {
		[
			{
				token: faker.random.uuid(),
				setting: {},
			}
		].forEach((testCase, index) => {

			const { token, setting } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const settingsId = faker.random.uuid();

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

					Settings.insert = () => {};
					stub(Settings, 'insert').callsFake(() => settingsId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Settings.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(settingsInsert.bind(null, token, setting)).toThrow();
				});

				test('successful Settings insert', () => {

					expect(settingsInsert(token, setting)).toEqual(settingsId);
				});
			});
		});
	});

	describe('settings.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				setting: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, setting } = testCase;

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

					Settings.update = () => {};
					stub(Settings, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Settings.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(settingsUpdate.bind(null, token, _id, setting)).toThrow();
				});

				test('successful Settings update', () => {

					expect(settingsUpdate(token, _id, setting)).toEqual(1);
				});
			});
		});
	});

	describe('settings.remove', () => {
		[
			{
				token: faker.random.uuid(),
				settingId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, settingId } = testCase;

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

					Settings.remove = () => {};
					stub(Settings, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Settings.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(settingsRemove.bind(null, token, settingId)).toThrow();
				});

				test('successful Settings remove', () => {

					expect(settingsRemove(token, settingId)).toEqual(1);
				});
			});
		});
	});
});
