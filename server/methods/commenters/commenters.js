import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import Commenters from '/imports/models/commenters';


/**
 * Commenter methods - either replaced or to be replaced with the graphql api
 */

const commentersInsert = (token, commenter) => {
	check(token, String);
	check(commenter, {
		name: String,
		slug: String,
		tenantId: String,
		wordpressId: Match.Optional(Match.OneOf(Number, undefined, null)),
		avatar: Match.Optional(Match.OneOf(Object, undefined, null)),
		featuredOnHomepage: Match.Optional(Match.OneOf(Boolean, undefined, null)),
		bio: Match.Optional(Match.OneOf(String, undefined, null)),
		tagline: Match.Optional(Match.OneOf(String, undefined, null)),
	});

	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Commenters.insert(commenter);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const commentersUpdate = (token, _id, commenter) => {
	check(token, String);
	check(_id, String);
	check(commenter, {
		name: String,
		slug: String,
		tenantId: String,
		wordpressId: Match.Optional(Match.OneOf(Number, undefined, null)),
		avatar: Match.Optional(Match.OneOf(Object, undefined, null)),
		featuredOnHomepage: Match.Optional(Match.OneOf(Boolean, undefined, null)),
		bio: Match.Optional(Match.OneOf(String, undefined, null)),
		tagline: Match.Optional(Match.OneOf(String, undefined, null)),
	});

	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Commenters.update({
			_id
		}, {
			$set: commenter,
		});
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const commentersRemove = (token, commenterId) => {
	check(token, String);
	check(commenterId, String);

	if (
		Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})) {
		return Commenters.remove(commenterId);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};


Meteor.methods({
	'commenters.insert': commentersInsert,
	'commenters.update': commentersUpdate,
	'commenters.remove': commentersRemove,
});

export { commentersInsert, commentersUpdate, commentersRemove };
