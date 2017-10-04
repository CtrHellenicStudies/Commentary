import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Editions from '/imports/models/editions';

const multilineInsert = (token, edition, multiline) => {
	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	})
	) {
		throw new Meteor.Error('keyword-insert', 'not-authorized');
	}

	check(multiline, String);

	const currentEdition = Editions.findOne(edition._id);
	const currentMultiline = currentEdition.multiLine && currentEdition.multiLine.length ? currentEdition.multiLine : [];

	currentMultiline.push(multiline);

	Editions.update(edition._id, {$set: {multiLine: currentMultiline}});
};

const multilineDelete = (token, edition, multiline) => {
	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	})
	) {
		throw new Meteor.Error('keyword-insert', 'not-authorized');
	}

	check(multiline, String);

	const currentEdition = Editions.findOne(edition._id);
	const multilineIndex = currentEdition.multiLine.indexOf(multiline);
	currentEdition.multiLine.splice(multilineIndex, 1);

	Editions.update(edition._id, {$set: currentEdition});
};

Meteor.methods({
	'multiline.insert': multilineInsert,
	'multiline.delete': multilineDelete,
});

export { multilineInsert, multilineDelete };
