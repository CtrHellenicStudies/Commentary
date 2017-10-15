import {Meteor} from 'meteor/meteor';
import Comments from '/imports/models/comments';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
	renameMentioned: (token) => {
		check(token, String);

		const roles = ['admin'];
		if (!Meteor.users.findOne({
			roles: {$elemMatch: {$in: roles}},
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
		) {
			throw new Meteor.Error('renameMentioned', 'not-authorized');
		}

		Comments.find({'keywords.isMentionedInLemma': true}).forEach((comment) => {
			const updatedKeywords = comment.keywords.map(keyword => {
				const thisKeyword = keyword;
				if ('isMentionedInLemma' in keyword) {
					thisKeyword.isNotMentionedInLemma = !keyword.isMentionedInLemma;
					delete thisKeyword.isMentionedInLemma
				}
				return thisKeyword;
			});

			if (comment._id === "2QLDAGDCostJoZsPa") {
				console.log("updatedKeywords LOG", updatedKeywords);
			}
			// Comments.update(comment._id, {$set: {keywords: updatedKeywords}});
		});
	}
});
