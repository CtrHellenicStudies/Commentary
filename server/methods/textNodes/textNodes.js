import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { stripTags } from 'underscore.string';

import TextNodes from '/imports/models/textNodes';
import { getAuthorizedUser } from '../helpers';

const textNodesInsert = (token, textNode) => {
	check(token, String);
	check(textNode, {
		work: {
			slug: String,
		},
		subwork: {
			slug: String,
			n: String,
		},
		text: Array,
	});

	const roles = ['editor', 'admin', 'commenter'];
	if (!getAuthorizedUser(roles, token)) {
		throw new Meteor.Error('text-editor', 'User is not authorized to edit this text');
	}

	return TextNodes.insert(textNode);
};

const textNodesUpdate = (token, _id, textNode) => {
	check(token, String);
	check(_id, String);
	check(textNode, {
		work: {
			slug: String,
		},
		subwork: {
			slug: String,
			n: String,
		},
		text: Array,
	});

	const roles = ['editor', 'admin', 'commenter'];
	if (!getAuthorizedUser(roles, token)) {
		throw new Meteor.Error('text-editor', 'User is not authorized to edit this text');
	}

	return TextNodes.update({
		_id
	}, {
		$set: textNode,
	});
};

const textNodesUpdateTextForEdition = (token, _id, editionId, updatedText, updatedTextN) => {
	check(token, String);
	check(_id, String);
	check(editionId, String);
	check(updatedText, String);
	check(updatedTextN, Number);

	const roles = ['editor', 'admin', 'commenter'];
	if (!getAuthorizedUser(roles, token)) {
		throw new Meteor.Error('text-editor', 'User is not authorized to edit this text');
	}

	const textNode = TextNodes.findOne({ _id: new Mongo.ObjectID(_id) });
	if (!textNode) {
		throw new Meteor.Error('text-editor', 'Unable to update text for provided text node ID');
	}

	const textNodeTextValues = textNode.text.slice();
	textNodeTextValues.forEach(textValue => {
		if (textValue.edition === editionId) {
			textValue.html = updatedText;
			textValue.n = updatedTextN;
			textValue.text = stripTags(updatedText);
		}
	});

	return TextNodes.update({
		_id: new Mongo.ObjectID(_id),
	}, {
		$set: {
			text: textNodeTextValues,
		},
	});
};

const textNodesRemove = (token, textNodeId) => {
	check(token, String);
	check(textNodeId, String);

	const roles = ['editor', 'admin', 'commenter'];
	if (!getAuthorizedUser(roles, token)) {
		throw new Meteor.Error('text-editor', 'User is not authorized to edit this text');
	}

	return TextNodes.remove(textNodeId);
};

const getMaxLine = (workSlug, subworkN) => {
	check(workSlug, String);
	check(subworkN, Number);

	let maxLine = 0;

	if (workSlug === 'homeric-hymns') {
		workSlug = 'hymns';
	}

	const _maxLine = TextNodes.aggregate([{
		$match: {
			'work.slug': workSlug,
			'subwork.n': subworkN,
		},
	}, {
		$group: {
			_id: 'maxLine',
			maxLine: {
				$max: '$text.n',
			},
		},
	}]);

	if (_maxLine && _maxLine.length) {
		maxLine = _maxLine[0].maxLine[0]; // granted that all text.editions have the same max line number
	}

	return maxLine;
};

const getTableOfContents = () => {
	const tableOfContents = TextNodes.aggregate([{
		$group: {
			_id: '$work.slug',
			subworks: {
				$addToSet: '$subwork.n',
			},
		},
	}]);
	tableOfContents.forEach((work) => {
		work.subworks.sort((a, b) => a - b);
	});
	return tableOfContents;
};

Meteor.methods({
	'textNodes.insert': textNodesInsert,
	'textNodes.update': textNodesUpdate,
	'textNodes.updateTextForEdition': textNodesUpdateTextForEdition,
	'textNodes.remove': textNodesRemove,
	getMaxLine,
	getTableOfContents,
});

export { textNodesInsert, textNodesUpdate, textNodesRemove };
