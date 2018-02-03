import _ from 'underscore';

import Utils from '../../../lib/utils';


/*
	helpers
*/

const getCommentGroupId = (commentGroup) => {
	let id = '';
	commentGroup.comments.forEach((comment) => {
		id += `-${comment._id}`;
	});
	return id.slice(1);
};

function addCommetersToCommentGroup(comment, commenters = {}) {
	comment.commenters.map(function(_commenter) {
		commenters[_commenter._id] = _commenter;
		return true;
	});
	return commenters;
}

function isFromCommentGroup(comment, commentGroup) {
	return _.isMatch(comment.lemmaCitation, commentGroup.lemmaCitation);
}

const parseCommentsToCommentGroups = (comments) => {
	const commentGroups = [];
	// Make comment groups from comments
	let isInCommentGroup = false;
	comments.map((comment) => {
		isInCommentGroup = false;
		if (comment.lemmaCitation) {
			commentGroups.map((commentGroup) => {
				if (isFromCommentGroup(comment, commentGroup)) {
					isInCommentGroup = true;
					commentGroup.comments.push(comment);
				}
				return true;
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
		return true;
	});
	commentGroups.map((commentGroup) => {
		commentGroup._id = getCommentGroupId(commentGroup);
		commentGroup.commenters = {};
		commentGroup.comments.map((comment) => {
			addCommetersToCommentGroup(comment, commentGroup.commenters);
			return true;
		});
		return true;
	});
	return commentGroups;
};
function setPageTitleAndMeta (filters, settings, commentGroups, worksQuery) {
	let title = '';
	let values = [];
	const workDefault = 'Commentary';
	let work = '';
	let passage = '';
	let metaSubject = 'Commentaries on Classical Texts';
	let description = '';

	if (!settings) {
		return null;
	}

	filters.forEach((filter) => {
		values = [];
		switch (filter.key) {
		case 'works':
			filter.values.forEach((value) => {
				values.push(value.slug);
			});
			work = values.join(', ');
			break;

		case 'passage':
			passage = filter.values[0];
			break;
		}
	});

	const foundWork = worksQuery.loading ? {} : worksQuery.collections[0].textGroups[0].works.find(x => x.slug === work)
	if (foundWork) {
		title = foundWork.title;
	} else {
		title = workDefault;
	}

	if (passage) {
		title = `${title}.${passage}`;
	}

	title = `${title} | ${settings.title || ''}`;

	metaSubject = `${metaSubject}, ${title}, Philology`;

	if (
		commentGroups.length
		&& commentGroups[0].comments.length
		&& commentGroups[0].comments[0].revisions.length
	) {
		description = Utils.trunc(commentGroups[0].comments[0].revisions[0].text, 120);
	}

	Utils.setMetaTag('name', 'subject', 'content', metaSubject);
	Utils.setTitle(title);
	Utils.setDescription(`Commentary on ${title}: ${description}`);
	Utils.setMetaImage();
};
export {
	parseCommentsToCommentGroups,
	getCommentGroupId,
	setPageTitleAndMeta
};
