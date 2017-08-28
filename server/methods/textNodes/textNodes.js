import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import TextNodes from '/imports/models/textNodes';

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

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return TextNodes.insert(textNode);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
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

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return TextNodes.update({
			_id
		}, {
			$set: textNode,
		});
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const textNodesRemove = (token, textNodeId) => {
	check(token, String);
	check(textNodeId, String);

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return TextNodes.remove(textNodeId);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

Meteor.methods({
	getMaxLine(workSlug, subworkN) {
		check(workSlug, String);
		check(subworkN, Number);
		if (workSlug === 'homeric-hymns') {
			workSlug = 'hymns';
		}
		const maxLine = TextNodes.aggregate([{
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

		return maxLine[0].maxLine[0]; // granted that all text.editions have the same max line number
	},

	getTableOfContents() {
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
	},
	'textNodes.insert': textNodesInsert,
	'textNodes.update': textNodesUpdate,
	'textNodes.remove': textNodesRemove,
});

export { textNodesInsert, textNodesUpdate, textNodesRemove };
