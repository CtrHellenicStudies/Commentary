// meteor:
import { Meteor } from 'meteor/meteor';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// tested module:
import { bookmarkInsert, bookmarkRemove } from './bookmark';


describe('Bookmarks methods API', () => {
	describe('bookmark.insert', () => {
		[
			{
				textNodeId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { textNodeId } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'userId').callsFake(() => ({}));
					stub(Meteor.users, 'update').callsFake(() => true);

				});

				afterEach(() => {

					Meteor.userId.restore();
					Meteor.users.update.restore();

				});

				test(`user is not logged in, should return error`, () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(bookmarkInsert.bind(null, textNodeId)).toThrow();
				});

				test(`user update fail, should return error`, () => {

					Meteor.users.update.restore();
					stub(Meteor.users, 'update').callsFake(() => {throw new Error()});

					expect(bookmarkInsert.bind(this, textNodeId)).toThrow();
				});

				test(`successfully update user with bookmark`, () => {

					expect(bookmarkInsert(textNodeId)).toBeTruthy();
				});
			});
		});
	});
	
	describe('bookmark.remove', () => {
		[
			{
				textNodeId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { textNodeId } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'userId').callsFake(() => ({}));
					stub(Meteor.users, 'update').callsFake(() => true);

				});

				afterEach(() => {

					Meteor.userId.restore();
					Meteor.users.update.restore();

				});

				test(`user is not logged in, should return error`, () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(bookmarkRemove.bind(null, textNodeId)).toThrow();
				});

				test(`user update fail, should return error`, () => {

					Meteor.users.update.restore();
					stub(Meteor.users, 'update').callsFake(() => {throw new Error()});

					expect(bookmarkRemove.bind(this, textNodeId)).toThrow();
				});

				test(`successfully update user with bookmark`, () => {

					expect(bookmarkRemove(textNodeId)).toBeTruthy();
				});
			});
		});
	});
});
