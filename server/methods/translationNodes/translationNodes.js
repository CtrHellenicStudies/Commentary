import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import TranslationNodes from '/imports/models/translationNodes';
import { getAuthorizedUser } from '../helpers';

const translationsNodeInsert = (token, translationNode) => {
	check(token, String);
	check(translationNode, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	return TranslationNodes.insert(translationNode);
};

Meteor.methods({
	'translationNode.insert': translationsNodeInsert,
});

export {
	translationsNodeInsert,
};
