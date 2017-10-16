// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

// npm:
import { stub, mock } from 'sinon';
import faker from 'faker';

// lib:
import Utils from '/imports/lib/utils';
import Config from '/imports/lib/_config/_config.js';

// models:
import Comments from '/imports/models/comments';
import DiscussionComments from '/imports/models/discussionComments';
import * as emailMethods from './emails';

// tested module:
import { deleteDiscussionComments, insertDiscussionComment, updateDiscussionComment, discussionCommentsUpdate, upvoteDiscussionComment, reportDiscussionComment, unreportDiscussionComment } from './discussionComments';


describe('DiscussionComments methods API', () => {

	beforeAll(() => {

		stub(emailMethods, 'sendDiscussionCommentInsertEmail').callsFake(() => {});
		stub(emailMethods, 'sendDiscussionCommentRejectEmail').callsFake(() => {});
		stub(emailMethods, 'sendDiscussionCommentPublishEmail').callsFake(() => {});

	});

	afterAll(() => {

		emailMethods.sendDiscussionCommentInsertEmail.findOne.restore();
		emailMethods.sendDiscussionCommentRejectEmail.findOne.restore();
		emailMethods.sendDiscussionCommentPublishEmail.findOne.restore();

	});

	describe('discussionComments.delete', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, _id } = testCase;

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

					DiscussionComments.remove = () => {};
					stub(DiscussionComments, 'remove').callsFake(() => 1);

					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					DiscussionComments.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('user with correct privileges not found, should return error', () => {

					Accounts._hashLoginToken.restore();
					stub(Accounts, '_hashLoginToken').callsFake(() => null);

					expect(deleteDiscussionComments.bind(null, token, _id)).toThrow();
				});

				test('successful discussion comments remove', () => {

					expect(deleteDiscussionComments(token, _id)).toBe(_id);
				});
			});
		});
	});

	describe('discussionComments.insert', () => {
		[
			{
				discussionCommentCandidate: {
					content: String,
					tenantId: faker.random.uuid(),
					commentId: faker.random.uuid(),
				},
			},
		].forEach((testCase, index) => {

			const { discussionCommentCandidate } = testCase;

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'user').callsFake(() => true);
					stub(Comments, 'findOne').callsFake(() => ({
						discussionCommentsDisabled: false,
					}));
					DiscussionComments.insert = () => {};
					stub(DiscussionComments, 'insert').callsFake(() => true);

				});

				afterEach(() => {
					Meteor.user.restore();
					Comments.findOne.restore();
					DiscussionComments.insert.restore();
				});

				test('user not logged in, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => false);

					expect(insertDiscussionComment.bind(null, discussionCommentCandidate)).toThrow();
				});

				test('discussion comment disabled, should return error', () => {

					Comments.findOne.restore();
					stub(Comments, 'findOne').callsFake(() => ({
						discussionCommentsDisabled: true,
					}));

					expect(insertDiscussionComment.bind(null, discussionCommentCandidate)).toThrow();
				});

				test('successful discussion comments insert', () => {

					expect(insertDiscussionComment(discussionCommentCandidate)).toBe(undefined);
				});
			});
		});
	});

	describe('discussionComments.update', () => {
		[
			{
				token: faker.random.uuid(),
				discussionCommentId: faker.random.uuid(),
				discussionCommentData: {
					status: faker.lorem.word,
				}
			},
		].forEach((testCase, index) => {

			const { token, discussionCommentId, discussionCommentData } = testCase;

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (attr.roles === 'admin'
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return true;
						}
						return false;
					});

					stub(Meteor, 'userId').callsFake(() => userId);

					stub(DiscussionComments, 'findOne').callsFake(() => ({
						userId: userId,
					}));

					DiscussionComments.update = () => {};
					stub(DiscussionComments, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Meteor.userId.restore();
					DiscussionComments.findOne.restore();
					DiscussionComments.update.restore();
				});

				test('user not allowed to edit, should return error', () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => faker.random.uuid());

					expect(updateDiscussionComment.bind(null, token, discussionCommentId, discussionCommentData)).toThrow();
				});

				test('successful discussion comments remove', () => {

					expect(updateDiscussionComment(token, discussionCommentId, discussionCommentData)).toBe(undefined);
				});
			});
		});
	});

	describe('discussionComments.upvote', () => {
		[
			{
				discussionCommentId: faker.random.uuid(),
			},
		].forEach((testCase, index) => {

			const { discussionCommentId } = testCase;

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'userId').callsFake(() => userId);

					stub(DiscussionComments, 'findOne').callsFake(() => ({
						voters: [faker.random.uuid(), faker.random.uuid()],
					}));

					DiscussionComments.update = () => {};
					stub(DiscussionComments, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.userId.restore();
					DiscussionComments.findOne.restore();
					DiscussionComments.update.restore();
				});

				test('user not logged in, should return error', () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(upvoteDiscussionComment.bind(null, discussionCommentId)).toThrow();
				});

				test('user allready upvoted before, should return error', () => {

					DiscussionComments.findOne.restore();

					stub(DiscussionComments, 'findOne').callsFake(() => ({
						voters: [userId],
					}));

					expect(upvoteDiscussionComment.bind(null, discussionCommentId)).toThrow();
				});

				test('successful discussion comments upvote', () => {

					expect(upvoteDiscussionComment(discussionCommentId)).toBe(undefined);
				});
			});
		});
	});

	describe('discussionComments.report', () => {
		[
			{
				discussionCommentId: faker.random.uuid(),
			},
		].forEach((testCase, index) => {

			const { discussionCommentId } = testCase;

			const userId = faker.random.uuid();

			const discussionCommentUserId = faker.random.uuid();

			const commentId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor.users, 'findOne').callsFake(() => ({
						username: faker.internet.userName(),
						profile: {
							name: faker.name.firstName(),
						},
					}));

					stub(Meteor, 'userId').callsFake(() => userId);

					stub(DiscussionComments, 'findOne').callsFake(() => ({
						userId: discussionCommentUserId,
						created: faker.date.past()
						// usersReported: [],
					}));

					stub(Comments, 'findOne').callsFake(() => ({
						_id: commentId,
						revisions: [{
							title: faker.lorem.word(),
						}],
					}));

					DiscussionComments.update = () => {};
					stub(DiscussionComments, 'update').callsFake(() => 1);

					stub(Utils, 'sortRevisions').callsFake(() => {});

				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Meteor.userId.restore();
					Comments.findOne.restore();
					DiscussionComments.findOne.restore();
					DiscussionComments.update.restore();
				});

				test('user not logged in, should return error', () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(reportDiscussionComment.bind(null, discussionCommentId)).toThrow();
				});

				test('user allready reported the discussion comment, should return error', () => {

					DiscussionComments.findOne.restore();
					stub(DiscussionComments, 'findOne').callsFake(() => ({
						userId: discussionCommentUserId,
						usersReported: [userId],
					}));

					expect(reportDiscussionComment.bind(null, discussionCommentId)).toThrow();
				});

				test('successful discussion comments remove', () => {

					expect(reportDiscussionComment(discussionCommentId)).toBe(undefined);
				});
			});
		});
	});

	describe('discussionComments.unreport', () => {
		[
			{
				discussionCommentId: faker.random.uuid(),
			},
		].forEach((testCase, index) => {

			const { discussionCommentId } = testCase;

			const userId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'userId').callsFake(() => userId);

					stub(DiscussionComments, 'findOne').callsFake(() => ({
						userId: userId,
					}));

					DiscussionComments.update = () => {};
					stub(DiscussionComments, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.userId.restore();
					DiscussionComments.findOne.restore();
					DiscussionComments.update.restore();
				});

				test('user not logged in, should return error', () => {

					Meteor.userId.restore();
					stub(Meteor, 'userId').callsFake(() => null);

					expect(unreportDiscussionComment.bind(null, discussionCommentId)).toThrow();
				});

				test('successful discussion comments unreport', () => {

					expect(unreportDiscussionComment(discussionCommentId)).toBe(undefined);
				});
			});
		});
	});
});
