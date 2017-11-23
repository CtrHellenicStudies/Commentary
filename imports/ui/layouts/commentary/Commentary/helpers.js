
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
	commentGroup.comments.forEach((comment) => {
		id += `-${comment._id}`;
	});
	return id.slice(1);
};
function addCommetersToCommentGroup(allCommenters, comment, commenters = {}) {
	comment.commenters.map((_commenter) => {
		const commenter = allCommenters.find(x => x.slug === _commenter.slug);
		if (commenter) {
			commenters[commenter._id] = commenter;
		}
	});
	return commenters;
}
function isFromCommentGroup(comment, commentGroup) {
	return comment.work.title === commentGroup.work.title
		&& comment.subwork.n === commentGroup.subwork.n
		&& comment.lineFrom === commentGroup.lineFrom
		&& comment.lineTo === commentGroup.lineTo;
}
function getCommentsQuery(filters, tenantId) {
	const query = createQueryFromFilters(filters);
	query.tenantId = tenantId;
	if ('$text' in query) {
		const textsearch = new RegExp(query.$text, 'i');
		if (!query.$or) {
			query.$or = [
				{ 'revisions.title': textsearch },
				{ 'revisions.text': textsearch },
			];
		} else {
			query.$or.push({$and: [			
				{ 'revisions.title': textsearch },
				{ 'revisions.text': textsearch }]});
		}
		delete query.$text;
	}
	query.tenantId = tenantId;
	return JSON.stringify(query);
}
const parseCommentsToCommentGroups = (comments, allCommenters) => {
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
	});
	commentGroups.map((commentGroup) => {
		commentGroup._id = getCommentGroupId(commentGroup);
		commentGroup.commenters = {};
		commentGroup.comments.map((comment) => {
			addCommetersToCommentGroup(allCommenters, comment, commentGroup.commenters);
		});
	});

	return commentGroups;
};

export {
	parseCommentsToCommentGroups,
	getCommentGroupId,
	getCommentsQuery
};
