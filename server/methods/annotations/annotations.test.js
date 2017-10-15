// meteor:
import { Meteor } from 'meteor/meteor';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// models:
import Books from '/imports/models/books';
import Comments from '/imports/models/comments';

// tested module:
import { annotationsInsert, annotationsAddRevision, annotationsDelete } from './annotations';


describe('Annotations methods API', () => {
	describe('annotations.insert', () => {
		[
			{
				token: faker.random.uuid(),
				comment: {
					tenantId: faker.random.uuid(),
					isAnnotation: faker.random.boolean(),
					users: [faker.internet.userName()],
					paragraphN: faker.random.number(),
					bookChapterUrl: faker.internet.url(),
					parentCommentId: faker.random.uuid(),
					revisions: [{
						tenantId: faker.random.uuid(),
						title: faker.name.title(),
						text: faker.lorem.text(),
						textRaw: {},
					}],
				}
			}
		].forEach((testCase, index) => {

			const { token, comment } = testCase;

			const commentInserId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					const bookId = faker.random.uuid();

					stub(Meteor, 'user').callsFake(() => ({
						canAnnotateBooks: [bookId],
					}));

					stub(Books, 'findOne').callsFake(() => ({
						_id: bookId,
					}));
					Comments.insert = () => {};
					stub(Comments, 'insert').callsFake(comment => commentInserId);
				});

				afterEach(() => {
					Meteor.user.restore();
					Books.findOne.restore();
					Comments.insert.restore();
				});

				test('user is not logged in, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test('book not found by bookChpterUrl in comment, should return error', () => {

					Books.findOne.restore();
					stub(Books, 'findOne').callsFake(() => null);

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test('user not authorized to annotate book, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => ({
						canAnnotateBooks: ['wrongBookId'],
					}));

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test('successful annotation insert', () => {

					expect(annotationsInsert(token, comment)).toBe(commentInserId);
				});
			});
		});
	});

	describe('annotations.addRevision', () => {
		[
			{
				token: faker.random.uuid(),
				commentId: faker.random.uuid(),
				revision: {
					tenantId: faker.random.uuid(),
					title: faker.name.title(),
					text: faker.lorem.text(),
					textRaw: {},
				}
			}
		].forEach((testCase, index) => {

			const { token, commentId, revision } = testCase;

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					const bookId = faker.random.uuid();

					stub(Meteor, 'user').callsFake(() => ({
						_id: userId,
						canAnnotateBooks: [bookId],
					}));

					stub(Comments, 'findOne').callsFake(() => ({
						_id: bookId,
					}));
					Comments.update = () => {};
					stub(Comments, 'update').callsFake(comment => 1);
				});

				afterEach(() => {
					Meteor.user.restore();
					Comments.findOne.restore();
					Comments.update.restore();
				});

				test('user is not logged in, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(annotationsAddRevision.bind(null, token, commentId, revision)).toThrow();
				});

				test('user is not an owner of the comment, should return error', () => {

					Comments.findOne.restore();
					stub(Comments, 'findOne').callsFake(() => null);

					expect(annotationsAddRevision.bind(null, token, commentId, revision)).toThrow();
				});

				test('successful annotation update', () => {

					expect(annotationsAddRevision(token, commentId, revision)).toBe(commentId);
				});
			});
		});
	});



	describe('annotations.delete', () => {
		[
			{
				token: faker.random.uuid(),
				commentId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, commentId } = testCase;

			describe(`Test Case ${index}`, () => {

				const userId = faker.random.uuid();

				beforeEach(() => {
					const bookId = faker.random.uuid();

					stub(Meteor, 'user').callsFake(() => ({
						_id: userId,
						canAnnotateBooks: [bookId],
					}));

					Comments.remove = () => {};
					stub(Comments, 'remove').callsFake(comment => 1);
				});

				afterEach(() => {
					Meteor.user.restore();
					Comments.remove.restore();
				});

				test('user is not logged in, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(annotationsDelete.bind(null, token, commentId)).toThrow();
				});

				test('successful annotation remove', () => {

					expect(annotationsDelete(token, commentId)).toBe(commentId);
				});
			});
		});
	});
});
