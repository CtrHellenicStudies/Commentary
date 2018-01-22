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
	return comment.work.title === commentGroup.work.title
		&& comment.subwork.n === commentGroup.subwork.n
		&& comment.lineFrom === commentGroup.lineFrom
		&& comment.lineTo === commentGroup.lineTo;
}
const parseCommentsToCommentGroups = (comments) => {
	const commentGroups = [];
	// Make comment groups from comments
	let isInCommentGroup = false;
	comments.map((comment) => {
		isInCommentGroup = false;
		if (comment.work) {
			commentGroups.map((commentGroup) => {
				if (isFromCommentGroup(comment, commentGroup)) {
					isInCommentGroup = true;
					commentGroup.comments.push(comment);
				}
				return true;
			});

			if (!isInCommentGroup) {
				let ref;

				if (comment.work.title === 'Homeric Hymns') {
					ref = `Hymns ${comment.subwork.n}.${comment.lineFrom}`;
				} else {
					ref = `${comment.work.title} ${comment.subwork.n}.${comment.lineFrom}`;
				}

				commentGroups.push({
					ref,
					selectedLemmaEdition: {
						lines: [],
					},
					work: comment.work,
					subwork: comment.subwork,
					lineFrom: comment.lineFrom,
					lineTo: comment.lineTo,
					nLines: comment.nLines,
					comments: [comment],
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
	let subwork = null;
	let lineFrom = 0;
	let lineTo = 0;
	let work = '';
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

		case 'subworks':
			filter.values.forEach((value) => {
				values.push(value.n);
			});
			subwork = values.join(', ');
			break;

		case 'lineFrom':
			lineFrom = filter.values[0];
			break;

		case 'lineTo':
			lineTo = filter.values[0];
			break;
		default:
			break;
		}
	});

	const foundWork = worksQuery.loading ? {} : worksQuery.collections[0].textGroups[0].works.find(x => x.slug === work)
	if (foundWork) {
		title = foundWork.title;
	} else {
		title = workDefault;
	}

	if (subwork) title = `${title} ${subwork}`;
	if (lineFrom) {
		if (lineTo) {
			title = `${title}.${lineFrom}-${lineTo}`;
		} else {
			title = `${title}.${lineFrom}`;
		}
	} else if (lineTo) {
		title = `${title}.${lineTo}`;
	} else {
		title = `${title}`;
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
