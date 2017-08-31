
// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// api:
import Translations from '/imports/models/translations';

// tested module:
import * as translationMethods from './translations';

function checkRole(roles, checkRoles) {
	return roles.$elemMatch.$in.find(role => (checkRoles.indexOf(role) > -1));
}

describe('Translations methods API', () => {
	describe('translations.insert', () => {
		[
			{
				token: faker.random.uuid(),
				comment: {}
			}
		].forEach((testCase, index) => {

			const { token, translation } = testCase;

			const translationId = faker.random.uuid();

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

					Translations.insert = () => {};
					stub(Translations, 'insert').callsFake(() => translationId);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Translations.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful comment insert', () => {

					expect(translationMethods.translationsInsert(token, translation)).toBe(translationId);
				});

			});
		});
	});
});
