import Comments from '/imports/models/comments';

/**
 * Prepare options to comment query
 * @param {number} skip - number of comments to skip
 * @param {number} limit - limit of comments to show
 */
function prepareGetCommentsOptions(skip, limit) {

	const options = {
		sort: {
			'work.order': 1,
			'subwork.n': 1,
			lineFrom: 1,
			nLines: -1,
		}
	};

	if (skip) {
		options.skip = skip;
	} else {
		options.skip = 0;
	}
	if (limit) {
		if (limit > 100) {
			options.limit = 100;
		}
		options.limit = limit;
	} else {
		options.limit = 30;
	}
	return options;
}
/**
 * Prepare args to comment query
 * @param {slug} workSlug 
 * @param {number} subworkN 
 * @param {string} tenantId - id of comment tenant
 */
function prepareGetCommentsArgs(workSlug, subworkN, tenantId) {
	const args = {};
	if ('work' in args) {
		args['work.slug'] = slugify(workSlug);
	}
	if ('subwork' in args) {
		args['subwork.n'] = subworkN;
	}

	if (tenantId) {
		args.tenantId = tenantId;
	}
	return args;
}

export { prepareGetCommentsOptions, prepareGetCommentsArgs };

