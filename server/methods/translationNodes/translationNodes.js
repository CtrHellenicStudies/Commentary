import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import TranslationNodes from '/imports/models/translationNodes';
import Works from '/imports/models/works';
import { getAuthorizedUser } from '../helpers';

const translationsNodeInsert = (token, translationNode) => {
	check(token, String);
	check(translationNode, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	return TranslationNodes.insert(translationNode);
};

const getTranslationNodesAuthors = (tenantId, workId, subwork) => {
	check(workId, String);
	check(tenantId, String);
	check(subwork, Number);

	const workSlug = Works.findOne(workId).slug;

	const translationNodesRaw = TranslationNodes.rawCollection();
	const distinct = Meteor.wrapAsync(translationNodesRaw.distinct, translationNodesRaw);

	const result = distinct('author', {work: workSlug, subwork, tenantId});
	return result
};

Meteor.methods({
	'translationNode.insert': translationsNodeInsert,
	'translationNodes.getAuthors': getTranslationNodesAuthors,
});

export {
	translationsNodeInsert,
	getTranslationNodesAuthors,
};
