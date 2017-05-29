// meteor:
import { Meteor } from 'meteor/meteor';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// api:
import Books from '/imports/api/collections/books';
import Comments from '/imports/api/collections/comments';

// tested module:
import { annotationsInsert, testError } from './annotations';


describe('Annotations methods API', () => {
	describe('annotations.insert', () => {
		[
			{
				id: 1,
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

			const { id, token, comment } = testCase;

			const commentInserId = faker.random.uuid();

			beforeEach(() => {
				const bookId = faker.random.uuid();

				stub(Meteor, 'user').callsFake(() => ({
					canAnnotateBooks: [bookId],
				}));

				stub(Books, 'findOne').callsFake(() => ({
					_id: bookId,
				}));
				Comments.insert = () => {};
				stub(Comments, 'insert').callsFake((comment) => commentInserId);
			});

			afterEach(() => {
				Meteor.user.restore();
				Books.findOne.restore();
				Comments.insert.restore();
			});

			describe(`Test Case ${id}`, () => {

				test(`user is not logged in, should return error`, () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test(`book not found by bookChpterUrl in comment, should return error`, () => {

					Books.findOne.restore();
					stub(Books, 'findOne').callsFake(() => null);

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test(`user not authorized to annotate book, should return error`, () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => ({
						canAnnotateBooks: ['wrongBookId'],
					}));

					expect(annotationsInsert.bind(null, token, comment)).toThrow();
				});

				test(`successful annotation insert`, () => {

					expect(annotationsInsert(token, comment)).toBe(commentInserId);
				});
			});
		});
	});
});
