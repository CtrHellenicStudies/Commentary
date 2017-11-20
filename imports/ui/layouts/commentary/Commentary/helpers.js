// models:
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';

/*
	helpers
*/

const createQueryFromFilters = (filters) => {
	const query = {};
	let values = [];
	if (filters) {
		filters.forEach((filter) => {
			switch (filter.key) {
			case '_id':
				// query._id = filter.values[0];
				query.$or = [{_id: filter.values[0]}, {urn: filter.values[0]}];
				break;
			case 'textsearch':
				query.$text = {
					$search: filter.values[0],
				};
				break;
			case 'keyideas':
			case 'keywords':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['keywords.slug'] = {
					$in: values,
				};
				break;

			case 'commenters':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['commenters.slug'] = {
					$in: values,
				};
				break;

			case 'reference':
				values = [];
				filter.values.forEach((value) => {
					values.push(value._id);
				});
				query['referenceWorks.referenceWorkId'] = {
					$in: values,
				};
				break;

			case 'works':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['work.slug'] = {
					$in: values,
				};
				break;

			case 'subworks':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.n);
				});
				query['subwork.n'] = {
					$in: values,
				};
				break;

			case 'lineFrom':
				// Values will always be an array with a length of one
				query.lineFrom = query.lineFrom || {};
				query.lineFrom.$gte = filter.values[0];
				break;

			case 'lineTo':
				// Values will always be an array with a length of one
				query.lineFrom = query.lineFrom || {};
				query.lineFrom.$lte = filter.values[0];
				break;

			case 'wordpressId':
				// Values will always be an array with a length of one
				query.wordpressId = filter.values[0];
				break;

			case 'urn':
				// Values will always be an array with a length of one
				if (!query.$or) {
					query.$or = [{'urn.v2': filter.values[0]}, {'urn.v1': filter.values[0]}];
				} else {
					query.$or.push({$and: [{ 'urn.v2': filter.values[0] }, {'urn.v1': filter.values[0]}]});
				}
				break;

			default:
				break;
			}
		});
	}

	return query;
};


const getCommentGroupId = (commentGroup) => {
	let id = '';
	let container = commentGroup.comments;
	if (!commentGroup.comments) {
		container = commentGroup;
	}
	container.forEach((comment) => {
		id += `-${comment._id}`;
	});
	return id.slice(1);
};

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
					console.log(comment.commenters);
					const commenter = Commenters.findOne({
						slug: comment.commenters[0].slug,
					});
					commentGroup.comments.push({comment: comment,
						commenter: commenter});
					commentGroup.commenters.push(commenter);
				}
			});

			if (!isInCommentGroup) {
				let ref;

				if (comment.work.title === 'Homeric Hymns') {
					ref = `Hymns ${comment.subwork.n}.${comment.lineFrom}`;
				} else {
					ref = `${comment.work.title} ${comment.subwork.n}.${comment.lineFrom}`;
				}
				const commenter = Commenters.findOne({
					slug: comment.commenters[0].slug
				});
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
					commenters: [commenter],
					_id: getCommentGroupId([comment])
				});
			}
		} else if (process.env.NODE_ENV === 'development') {
			console.error(`Review comment ${comment._id} metadata`);
		}
	});

	return commentGroups;
};

export {
	createQueryFromFilters,
	parseCommentsToCommentGroups,
	getCommentGroupId
};
