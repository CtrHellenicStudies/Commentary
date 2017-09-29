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

	// TODO: remove this after changing to workId instead of a slug
	const newTranslationNode = translationNode;
	const workSlug = Works.findOne(translationNode.work).slug;
	newTranslationNode.work = workSlug;

	return TranslationNodes.insert(newTranslationNode);
};

const translationsNodeUpdate = (token, translationNode) => {
	check(token, String);
	check(translationNode, Object);

	const query = {
		author: translationNode.author,
		n: translationNode.n,
		subwork: translationNode.subwork,
		work: translationNode.subwork
	};

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	return TranslationNodes.upsert(query, {$set: translationNode});
};

const translationsNodeRemove = (token, translationNodeId) => {
	check(token, String);
	check(translationNodeId, String);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	return TranslationNodes.remove(translationNodeId);
};

const addTranslationAuthor = (token, workDetails, authorName) => {
	check(authorName, String);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	// TODO: remove this after changing to workId instead of a slug
	const workSlug = Works.findOne(workDetails.work).slug;

	const newAuthor = Object.assign({}, workDetails, {author: authorName, work: workSlug});

	return TranslationNodes.insert(newAuthor);
};

const updateTranslationAuthor = (token, workDetails, prevAuthorName, newAuthorName) => {
	check(newAuthorName, String);
	check(prevAuthorName, String);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	// TODO: remove this after changing to workId instead of a slug
	const workSlug = Works.findOne(workDetails.work).slug;
	const queryParams = workDetails;
	queryParams.work = workSlug;
	queryParams.author = prevAuthorName;
	
	return TranslationNodes.update(queryParams, {$set: {author: newAuthorName}}, {multi: true});
};

const getTranslationNodesAuthors = (tenantId, workId, subwork) => {
	check(workId, String);
	check(tenantId, String);
	check(subwork, Number);

	const workSlug = Works.findOne(workId).slug;

	const translationNodesRaw = TranslationNodes.rawCollection();
	const distinct = Meteor.wrapAsync(translationNodesRaw.distinct, translationNodesRaw);

	return distinct('author', {work: workSlug, subwork, tenantId});
};

Meteor.methods({
	'translationNode.insert': translationsNodeInsert,
	'translationNode.update': translationsNodeUpdate,
	'translationNode.remove': translationsNodeRemove,
	'translationNodes.getAuthors': getTranslationNodesAuthors,
	'translationNodes.addAuthor': addTranslationAuthor,
	'translationNodes.updateAuthor': updateTranslationAuthor,
});

export {
	translationsNodeInsert,
	translationsNodeUpdate,
	getTranslationNodesAuthors,
	addTranslationAuthor,
};
