// meteor:
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';

// npm:
import { stub } from 'sinon';
import faker from 'faker';

// models:
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';

// tested module:
import * as commentMethods from './comments';

function checkRole(roles, checkRoles) {
	return roles.$elemMatch.$in.find(role => (checkRoles.indexOf(role) > -1));
}

describe('Comments methods API', () => {
	describe('comments.insert', () => {
		[
			{
				token: faker.random.uuid(),
				comment: {}
			}
		].forEach((testCase, index) => {

			const { token, comment } = testCase;

			const commentId = faker.random.uuid();

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];

			describe(`Test Case ${index}`, () => {
				beforeEach(() => {
					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] }));
					Comments.insert = () => {};
					stub(Comments, 'insert').callsFake(() => commentId);
					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);
				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Comments.insert.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful comment insert', () => {
					expect(commentMethods.commentsInsert(token, comment)).toBe(commentId);
				});
			});
		});
	});

	describe('comments.update', () => {
		[
			{
				token: faker.random.uuid(),
				commentId: faker.random.uuid(),
				update: {}
			}
		].forEach((testCase, index) => {

			const { token, commentId, update } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const commenterId = faker.random.uuid();
			const commenterSlug = faker.helpers.slugify(faker.name.firstName());

			const comment = {
				_id: commentId,
				commenters: [{
					_id: commenterId,
					slug: commenterSlug
				}],
			};

			const commenters = [{
				_id: commenterId,
				slug: commenterSlug,
			}];

			const user = {
				canEditCommenters: [commenterId],
				roles: ['admin']
			};

			const roles = ['editor', 'admin', 'commenter'];

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor.users, 'findOne').callsFake((attr) => user);
					Comments.update = () => {};
					stub(Comments, 'update').callsFake(() => 1);
					stub(Comments, 'findOne').callsFake(() => comment);
					stub(Commenters, 'find').callsFake(() => ({
						fetch: () => (commenters),
					}));
					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);
				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Comments.update.restore();
					Comments.findOne.restore();
					Commenters.find.restore();
					Accounts._hashLoginToken.restore();
				});

				test('wrong commentId passed to method, should return error', () => {

					Comments.findOne.restore();
					stub(Comments, 'findOne').callsFake(() => null);

					expect(commentMethods.commentsUpdate.bind(null, token, commentId, update)).toThrow();
				});

				test('user is not an owner of the comment, should return error', () => {
					Meteor.users.findOne.restore();
					const newUser = {
						canEditCommenters: [faker.random.uuid(), faker.random.uuid()],
					};
					stub(Meteor.users, 'findOne').callsFake((attr) => {
						if (checkRole(attr.roles, roles)
							&& attr['services.resume.loginTokens.hashedToken'] === hashedLoginToken) {
							return newUser;
						}
						return undefined;
					});

					expect(commentMethods.commentsUpdate.bind(null, token, commentId, update)).toThrow();
				});

				/*
				 TODO: fix test with subscriptions integration
				test('successful comment update', () => {
					expect(commentMethods.commentsUpdate(token, commentId, update)).toBe(commentId);
				});
				*/
			});
		});
	});

	describe('comments.remove', () => {
		[
			{
				token: faker.random.uuid(),
				commentId: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, commentId } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const roles = ['editor', 'admin', 'commenter'];

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] }));
					Comments.remove = () => {};
					stub(Comments, 'remove').callsFake(() => 1);
					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);
				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Comments.remove.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful comment remove', () => {
					expect(commentMethods.commentsRemove(token, commentId)).toBe(commentId);
				});
			});
		});
	});

	describe('comments.add.revision', () => {
		[
			{
				commentId: faker.random.uuid(),
				revision: {}
			}
		].forEach((testCase, index) => {

			const { commentId, revision } = testCase;

			const commenterId = faker.random.uuid();
			const commenterSlug = faker.helpers.slugify(faker.name.firstName());

			const comment = {
				_id: commentId,
				commenters: [{
					_id: commenterId,
					slug: commenterSlug
				}],
			};

			const commenters = [{
				_id: commenterId,
				slug: commenterSlug,
			}];

			const user = {
				_id: faker.random.uuid(),
				canEditCommenters: [commenterId],
			};

			const revisionId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'user').callsFake(() => user);

					stub(Roles, 'userIsInRole').callsFake(() => true);

					Comments.update = () => {};
					stub(Comments, 'update').callsFake(() => 1);

					stub(Comments, 'findOne').callsFake(() => comment);

					stub(Commenters, 'find').callsFake(() => ({
						fetch: () => (commenters),
					}));

					stub(Random, 'id').callsFake(() => revisionId);

				});

				afterEach(() => {
					Meteor.user.restore();
					Roles.userIsInRole.restore();
					Comments.update.restore();
					Comments.findOne.restore();
					Commenters.find.restore();
					Random.id.restore();
				});

				test('user not found, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(commentMethods.commentsAddRevision.bind(null, commentId, revision)).toThrow();
				});

				test('user with incorrect roles, should return error', () => {

					Roles.userIsInRole.restore();
					stub(Roles, 'userIsInRole').callsFake(() => false);

					expect(commentMethods.commentsAddRevision.bind(null, commentId, revision)).toThrow();
				});

				test('wrong commentId passed to method, should return error', () => {

					Comments.findOne.restore();
					stub(Comments, 'findOne').callsFake(() => null);

					expect(commentMethods.commentsAddRevision.bind(null, commentId, revision)).toThrow();
				});

				test('user is not an owner of the comment, should return error', () => {

					Meteor.user.restore();
					const newUser = {
						_id: faker.random.uuid(),
						canEditCommenters: [faker.random.uuid(), faker.random.uuid()],
					};
					stub(Meteor, 'user').callsFake(() => newUser);


					expect(commentMethods.commentsAddRevision.bind(null, commentId, revision)).toThrow();
				});

				/*
				TODO: fix comment test with new authentication permissions handling
				test('successful comment insert', () => {
					expect(commentMethods.commentsAddRevision(commentId, revision)).toBe(revisionId);
				});
				*/
			});
		});
	});

	describe('comments.remove.revision', () => {
		[
			{
				commentId: faker.random.uuid(),
				revision: {}
			}
		].forEach((testCase, index) => {

			const { commentId, revision } = testCase;

			const commenterId = faker.random.uuid();
			const commenterSlug = faker.helpers.slugify(faker.name.firstName());

			const comment = {
				_id: commentId,
				commenters: [{
					_id: commenterId,
					slug: commenterSlug
				}],
			};

			const commenters = [{
				_id: commenterId,
				slug: commenterSlug,
			}];

			const user = {
				_id: faker.random.uuid(),
				canEditCommenters: [commenterId],
			};

			const revisionId = faker.random.uuid();

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {

					stub(Meteor, 'user').callsFake(() => user);

					stub(Roles, 'userIsInRole').callsFake(() => true);

					Comments.update = () => {};
					stub(Comments, 'update').callsFake(() => 1);

				});

				afterEach(() => {
					Meteor.user.restore();
					Roles.userIsInRole.restore();
					Comments.update.restore();
				});

				test('user not found, should return error', () => {

					Meteor.user.restore();
					stub(Meteor, 'user').callsFake(() => null);

					expect(commentMethods.commentsRemoveRevision.bind(null, commentId, revision)).toThrow();
				});

				test('user with incorrect roles, should return error', () => {

					Roles.userIsInRole.restore();
					stub(Roles, 'userIsInRole').callsFake(() => false);

					expect(commentMethods.commentsRemoveRevision.bind(null, commentId, revision)).toThrow();
				});

				/*
				TODO: fix comment test with new authentication permissions handling
				test('successful comment insert', () => {
					expect(commentMethods.commentsRemoveRevision(commentId, revision)).toBe(undefined);
				});
				*/
			});
		});
	});

	describe('comments.toggleDiscussionComments', () => {
		[
			{
				token: faker.random.uuid(),
				_id: faker.random.uuid(),
			}
		].forEach((testCase, index) => {

			const { token, _id } = testCase;

			const hashedLoginToken = faker.random.uuid();

			const comment = {
				discussionCommentsDisabled: true,
			};

			const roles = ['editor', 'admin', 'commenter'];

			describe(`Test Case ${index}`, () => {

				beforeEach(() => {
					stub(Meteor.users, 'findOne').callsFake((attr) => ({ roles: ['admin'] })); 
					Comments.update = () => {};
					stub(Comments, 'update').callsFake(() => 1);
					stub(Comments, 'findOne').callsFake(() => comment);
					stub(Accounts, '_hashLoginToken').callsFake(() => hashedLoginToken);
				});

				afterEach(() => {
					Meteor.users.findOne.restore();
					Comments.update.restore();
					Comments.findOne.restore();
					Accounts._hashLoginToken.restore();
				});

				test('successful toggleDiscussionComments', () => {
					expect(commentMethods.commentsToggleDiscussionComments(token, _id)).toBe(undefined);
				});
			});
		});
	});
});
