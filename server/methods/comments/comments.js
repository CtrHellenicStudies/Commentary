import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { ObjectID } from 'bson';

import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import { getAuthorizedUser } from '../helpers';


/**
 * Comment methods - either replaced or to be replaced with the graphql api
 */





const commentsGetSuggestions = (token, value) => {
	check(value, String);
	if (!value.length) return Comments.find({}, { limit: 5, sort: { created: -1 } }).fetch();
	return Comments.find({ $text: { $search: value } }, { limit: 5, sort: { created: -1 } }).fetch();
};


Meteor.methods({
	'comments.getSuggestions': commentsGetSuggestions,
});

export {commentsGetSuggestions};
