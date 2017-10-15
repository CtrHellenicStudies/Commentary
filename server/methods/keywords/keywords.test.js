// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// models:
import Keywords from '/imports/models/keywords';

// tested module:
import { keywordsInsert, keywordsUpdate, keywordsDelete } from './keywords';

function checkRole(roles, checkRoles) {
	return roles.$elemMatch.$in.find(role => (checkRoles.indexOf(role) > -1));
}

function getKeywordIds(keywords) {
	const keywordsIds = [];
	keywords.forEach((keyword) => {
		keywordsIds.push(keyword.testId);
	});
	return keywordsIds;
}

describe('Keywords methods API', () => {

	describe('keywords.insert', () => {
		[
			{
				token: faker.random.uuid(),
				keywords: [{
					testId: faker.random.uuid(),
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
					tenantId: faker.random.uuid(),
					type: faker.lorem.word(),
				}, {
					testId: faker.random.uuid(),
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
					tenantId: faker.random.uuid(),
					type: faker.lorem.word(),
				}],
			}
		].forEach((testCase, index) => {

			const { token, keywords } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const keywordsIds = getKeywordIds(keywords);

			const roles = ['editor', 'admin', 'commenter'];
			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (checkRole(attr.roles, roles)
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Keywords.insert = () => {};
					stub(Keywords, 'insert').callsFake(keyword => keyword.testId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Keywords.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(keywordsInsert.bind(null, token, keywords)).toThrow();
				});

				test('successful keywords insert', () => {

					expect(keywordsInsert(token, keywords)).toEqual(keywordsIds);
				});
			});
		});
	});

	describe('keywords.update', () => {
		[
			{
				token: faker.random.uuid(),
				id: faker.random.uuid(),
				keywordCandidate: {
					testId: faker.random.uuid(),
					title: faker.lorem.word(),
					slug: faker.helpers.slugify(faker.lorem.word()),
					tenantId: faker.random.uuid(),
					type: faker.lorem.word(),
				},
			}
		].forEach((testCase, index) => {

			const { token, id, keywordCandidate } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];
			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (checkRole(attr.roles, roles)
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Keywords.update = () => {};
					stub(Keywords, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Keywords.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(keywordsUpdate.bind(null, token, id, keywordCandidate)).toThrow();
				});

				test('successful keywords update', () => {

					expect(keywordsUpdate(token, id, keywordCandidate)).toEqual(id);
				});
			});
		});
	});

	describe('keywords.delete', () => {
		[
			{
				token: faker.random.uuid(),
				keywordId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, keywordId } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];
			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (checkRole(attr.roles, roles)
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true; 
						}
						return false;
					});

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					Keywords.remove = () => {};
					stub(Keywords, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Keywords.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(keywordsDelete.bind(null, token, keywordId)).toThrow();
				});

				test('successful keywords remove', () => {

					expect(keywordsDelete(token, keywordId)).toEqual(keywordId);
				});
			});
		});
	});
});
