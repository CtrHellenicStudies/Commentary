// // meteor:
// import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
// import { Roles } from 'meteor/alanning:roles';

// // npm:
// import { stub } from 'sinon';
// import faker from 'faker';

// // api:
// import Comments from '/imports/api/collections/comments';
// import Commenters from '/imports/api/collections/commenters';

// // tested module:
// import { commentsInsert, commentsUpdate, commentsRemove, commentsAddRevision, commentsRemoveRevision, commentsGetSuggestions, commentsToggleDiscussionComments } from './comments';


// describe('Comments methods API', () => {
// 	describe('comments.insert', () => {
// 		[
// 			{
// 				token: faker.random.uuid(),
// 				comment: {}
// 			}
// 		].forEach((testCase, index) => {

// 			const { token, comment } = testCase;

// 			const commentId = faker.random.uuid();

// 			const hashedLoginToken = faker.random.uuid();

// 			const roles = ['editor', 'admin', 'commenter'];

// 			describe(`Test Case ${index}`, () => {

// 				beforeEach(() => {

// 					stub(Meteor.users, 'findOne').callsFake((attr) => {
// 						if (roles.indexOf(attr.roles) > -1
// 							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
// 							return true; 
// 						}
// 						return false;
// 					});

// 					Comments.insert = () => {};
// 					stub(Comments, 'insert').callsFake(() => commentId);

// 					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

// 				});

// 				afterEach(() => {
// 					Meteor.users.findOne.restore();
// 					Comments.insert.restore();
// 					Accounts._hashLoginToken.restore();
// 				});

// 				test(`user with correct privileges not found, should return error`, () => {

// 					Accounts._hashLoginToken.restore();
// 					stub(Accounts, '_hashLoginToken').callsFake(() => null);

// 					expect(commentsInsert.bind(null, token, comment)).toThrow();
// 				});

// 				test(`successful comment insert`, () => {

// 					expect(commentsInsert(token, comment)).toBe(commentId);
// 				});
// 			});
// 		});
// 	});

// 	describe('comments.update', () => {
// 		[
// 			{
// 				token: faker.random.uuid(),
// 				_id: faker.random.uuid(),
// 				book: {
// 					title: faker.name.title(),
// 					slug: faker.helpers.slugify(faker.name.title()),
// 					author: faker.name.firstName(),
// 					chapters: faker.random.number(),
// 					coverImage: faker.random.uuid(),
// 					tenantId: faker.random.uuid(),
// 					year: faker.random.number(),
// 					publisher: faker.random.uuid(),
// 					citation: faker.lorem.text(),
// 				}
// 			}
// 		].forEach((testCase, index) => {

// 			const { token, _id, book } = testCase;

// 			const hashedLoginToken = faker.random.uuid();

// 			describe(`Test Case ${index}`, () => {

// 				beforeEach(() => {

// 					stub(Meteor.users, 'findOne').callsFake((attr) => {
// 						if (attr.roles === 'admin'
// 							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
// 							return true; 
// 						}
// 						return false;
// 					});

// 					Books.update = () => {};
// 					stub(Books, 'update').callsFake(() => 1);

// 					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

// 				});

// 				afterEach(() => {
// 					Meteor.users.findOne.restore();
// 					Books.update.restore();
// 					Accounts._hashLoginToken.restore();
// 				});

// 				test(`user with correct privileges not found, should return error`, () => {

// 					Accounts._hashLoginToken.restore();
// 					stub(Accounts, '_hashLoginToken').callsFake(() => null);

// 					expect(bookUpdate.bind(null, token, _id, book)).toThrow();
// 				});

// 				test(`successful book update`, () => {

// 					expect(bookUpdate(token, _id, book)).toBe(1);
// 				});
// 			});
// 		});
// 	});

// 	describe('books.remove', () => {
// 		[
// 			{
// 				token: faker.random.uuid(),
// 				bookId: faker.random.uuid(),
// 			}
// 		].forEach((testCase, index) => {

// 			const { token, bookId } = testCase;

// 			const hashedLoginToken = faker.random.uuid();

// 			describe(`Test Case ${index}`, () => {

// 				beforeEach(() => {

// 					stub(Meteor.users, 'findOne').callsFake((attr) => {
// 						if (attr.roles === 'admin'
// 							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
// 							return true; 
// 						}
// 						return false;
// 					});

// 					Books.remove = () => {};
// 					stub(Books, 'remove').callsFake(() => 1);

// 					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

// 				});

// 				afterEach(() => {
// 					Meteor.users.findOne.restore();
// 					Books.remove.restore();
// 					Accounts._hashLoginToken.restore();
// 				});

// 				test(`user with correct privileges not found, should return error`, () => {

// 					Accounts._hashLoginToken.restore();
// 					stub(Accounts, '_hashLoginToken').callsFake(() => null);

// 					expect(bookRemove.bind(null, token, bookId)).toThrow();
// 				});

// 				test(`successful book remove`, () => {

// 					expect(bookRemove(token, bookId)).toBe(1);
// 				});
// 			});
// 		});
// 	});
// });
