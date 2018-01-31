const createQueryFromFilters = (filters) => {
	const query = {};
	let values = [];
	if (filters) {
		filters.forEach((filter) => {
			switch (filter.key) {
			case '_id':
				// query._id = filter.values[0];
				query.$or = [{_id: filter.values[0]}];
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

function getCommentsQuery(filters, tenantId, additionalParam) {
	const query = createQueryFromFilters(filters);
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
	if (additionalParam) {
		query._id = additionalParam._id;
	}
	query.tenantId = tenantId;
	return JSON.stringify(query);
}

export { getCommentsQuery };
