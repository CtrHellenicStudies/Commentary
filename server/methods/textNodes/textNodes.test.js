// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// models:
import TextNodes from '/imports/models/textNodes';

// tested module:
import { textNodesInsert, textNodesUpdate, textNodesRemove } from './textNodes';

describe('TextNodes methods API', () => {

	describe('textNodes.insert', () => {
		[
			{
				token: faker.random.uuid(),
				textNode: {},
			}
		].forEach((testCase, index) => {

			const { token, textNode } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const textNodeId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] }));

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					TextNodes.insert = () => {};
					stub(TextNodes, 'insert').callsFake(() => textNodeId);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					TextNodes.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful TextNodes insert', () => {

					expect(textNodesInsert(token, textNode)).toEqual(textNodeId);
				});
			});
		});
	});

	describe('textNodes.update', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
				textNode: {},
			}
		].forEach((testCase, index) => {

			const { token, _id, textNode } = testCase;

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] }));

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					TextNodes.update = () => {};
					stub(TextNodes, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					TextNodes.update.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful TextNodes update', () => {

					expect(textNodesUpdate(token, _id, textNode)).toEqual(1);
				});
			});
		});
	});

	describe('textNodes.remove', () => {
		[
			{
				token: faker.random.uuid(),
				textNodeId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, _id, textNode } = testCase;

			const hashedLoginToken = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] }));

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

					TextNodes.remove = () => {};
					stub(TextNodes, 'remove').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					TextNodes.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful TextNodes remove', () => {

					expect(textNodesRemove(token, _id, textNode)).toEqual(1);
				});
			});
		});
	});
});
