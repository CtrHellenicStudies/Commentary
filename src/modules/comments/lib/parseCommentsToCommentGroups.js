import _ from 'underscore';

import Utils from '../../../lib/utils';
import getCommentGroupId from './getCommentGroupId';


/**
 * Add unique commenters to the comment group
 */
const addCommetersToCommentGroup = (comment, commenters = {}) => {
	comment.commenters.forEach(function(_commenter) {
		commenters[_commenter._id] = _commenter;
	});
	return commenters;
}

/**
 * check if a comment is from the given comment group
 */
const isFromCommentGroup = (comment, commentGroup) => {
	return _.isMatch(comment.lemmaCitation, commentGroup.lemmaCitation);
}

/**
 * parse a list of comments into comment groups based on lemmaCitation
 */
const parseCommentsToCommentGroups = (comments) => {
	const commentGroups = [];

	// Make comment groups from comments
	let isInCommentGroup = false;
	comments.forEach((comment) => {
		isInCommentGroup = false;
		if (comment.lemmaCitation) {
			commentGroups.forEach((commentGroup) => {
				if (isFromCommentGroup(comment, commentGroup)) {
					isInCommentGroup = true;
					commentGroup.comments.push(comment);
				}
			});

			if (!isInCommentGroup) {
				commentGroups.push({
					selectedLemmaEdition: {
						lines: [],
					},
					nLines: comment.nLines,
					comments: [comment],
					lemmaCitation: comment.lemmaCitation,
				});
			}

		} else if (process.env.NODE_ENV === 'development') {
			console.error(`Review comment ${comment._id} metadata`);
		}
	});

	// Parse metadata for comment group
	commentGroups.forEach((commentGroup) => {
		// commentgroup id
		commentGroup._id = getCommentGroupId(commentGroup);
		// commenters
		commentGroup.commenters = {};
		commentGroup.comments.forEach((comment) => {
			addCommetersToCommentGroup(comment, commentGroup.commenters);
		});
	});

	return commentGroups;
};

export default parseCommentsToCommentGroups;
