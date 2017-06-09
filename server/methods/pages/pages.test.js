// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// api:
import Pages from '/imports/api/collections/pages.js';

// tested module:
import { pagesInsert, pagesUpdate, pagesRemove } from './pages';

describe('Pages methods API', () => {

	describe('pages.insert', () => {
		[
			{
				token: faker.random.uuid(),
				page: {
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
				},
			}
		].forEach((testCase, index) => {

			const { token, page } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const pageId = faker.random.uuid();

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

					Pages.insert = () => {};
					stub(Pages, 'insert').callsFake(() => pageId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Pages.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(pagesInsert.bind(null, token, page)).toThrow();
				});

				test('successful Pages insert', () => {

					expect(pagesInsert(token, page)).toEqual(pageId);
				});
			});
		});
	});

	describe('pages.update', () => {
		[
			{
				token: faker.random.uuid(),
				pageId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, pageId } = testCase;

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

					Pages.update = () => {};
					stub(Pages, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Pages.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(pagesUpdate.bind(null, token, pageId)).toThrow();
				});

				test('successful Pages update', () => {

					expect(pagesUpdate(token, pageId)).toEqual(1);
				});
			});
		});
	});

	describe('pages.remove', () => {
		[
			{
				token: faker.random.uuid(),
				pageId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, pageId } = testCase;

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

					Pages.remove = () => {};
					stub(Pages, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Pages.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(pagesRemove.bind(null, token, pageId)).toThrow();
				});

				test('successful Pages remove', () => {

					expect(pagesRemove(token, pageId)).toEqual(1);
				});
			});
		});
	});
});
