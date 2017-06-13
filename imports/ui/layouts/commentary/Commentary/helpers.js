// api:
import Commenters from '/imports/api/collections/commenters';
import Comments from '/imports/api/collections/comments';

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


const parseCommentsToCommentGroups = (comments) => {
	const commentGroups = [];
	// Make comment groups from comments
	let isInCommentGroup = false;
	comments.forEach((comment) => {
		isInCommentGroup = false;
		if ('work' in comment) {
			commentGroups.forEach((commentGroup) => {
				if (
					comment.work.title === commentGroup.work.title
					&& comment.subwork.n === commentGroup.subwork.n
					&& comment.lineFrom === commentGroup.lineFrom
					&& comment.lineTo === commentGroup.lineTo
				) {
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
		} else {
			console.log(`Review comment ${comment._id} metadata`);
		}
	});

	// Unique commenters for each comment group
	commentGroups.forEach((commentGroup, commentGroupIndex) => {
		// let isInCommenters = false;
		const commenters = [];
		// const commenterSubscription = Meteor.subscribe('commenters', Session.get('tenantId'));
		commentGroup.comments.forEach((comment, commentIndex) => {
			// isInCommenters = false;

			comment.commenters.forEach((commenter, i) => {
				const commenterRecord = Commenters.findOne({
					slug: commenter.slug,
				});
				if (commenterRecord) {
					commentGroups[commentGroupIndex].comments[commentIndex].commenters[i] = commenterRecord;

					// get commenter avatar
					if (commenterRecord.avatar) {
						commenterRecord.avatar = commenterRecord.avatar;
					}

					// add to the unique commenter set
					if (commenters.some(c => c.slug === commenter.slug)) {
						// isInCommenters = true;
					} else {
						commenters.push(commenterRecord);
					}
				}
			});
		});
		commentGroups[commentGroupIndex].commenters = commenters;

		commentGroup._id = getCommentGroupId(commentGroup);
	});

	return commentGroups;
};

export { createQueryFromFilters, parseCommentsToCommentGroups, getCommentGroupId };
