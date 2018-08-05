import _s from 'underscore.string';

/**
 * Set filters back to page 0
 */
const _resetFiltersPage = _filters => {
	const filters = _filters.slice();
	if (filters.some(filter => (filter.key === 'page'))) {
		filters.forEach(filter => {
			if (filter.key === 'page') {
				filter.values = [0];
			}
		});
	} else {
		filters.push({
			key: 'page',
			values: [0],
		});
	}

	return filters;
};


/**
 * given an input list of query params, create a list of filters for display and the database queries
 */
const _createFiltersFromQueryParams = (queryParams, referenceWorks = []) => {
	const filters = [];

	if (!queryParams) {
		return filters;
	}

	if ('_id' in queryParams) {
		filters.push({
			key: '_id',
			values: [queryParams._id],
		});
		if ('revision' in queryParams) {
			filters.push({
				key: 'revision',
				values: [Number(queryParams.revision)],
			});
		}
	}

	if ('textsearch' in queryParams) {
		filters.push({
			key: 'textsearch',
			values: [queryParams.textsearch],
		});
	}

	if ('keyideas' in queryParams) {
		const keyideas = [];

		queryParams.keyideas.split(',').forEach((keyidea) => {
			keyideas.push({
				slug: keyidea,
			});
		});

		filters.push({
			key: 'keyideas',
			values: keyideas,
		});
	}

	if ('keywords' in queryParams) {
		const keywords = [];

		queryParams.keywords.split(',').forEach((keyword) => {
			keywords.push({
				slug: keyword,
			});
		});

		filters.push({
			key: 'keywords',
			values: keywords,
		});
	}

	if ('commenters' in queryParams) {
		const commenters = [];

		queryParams.commenters.split(',').forEach((commenter) => {
			commenters.push({
				slug: commenter,
			});
		});

		filters.push({
			key: 'commenters',
			values: commenters,
		});
	}

	if ('reference' in queryParams) {
		const references = [];

		queryParams.reference.split(',').forEach((referenceId) => {
			referenceWorks.forEach((referenceWork) => {
				if (referenceWork._id === referenceId) {
					references.push(referenceWork);
				}
			});
		});

		filters.push({
			key: 'reference',
			values: references,
		});
	}

	if ('works' in queryParams) {
		const works = [];

		queryParams.works.split(',').forEach((work) => {
			works.push({
				slug: work,
				title: _s.capitalize(work),
			});
		});

		filters.push({
			key: 'works',
			values: works,
		});
	}

	if ('location' in queryParams) {
		filters.push({
			key: 'location',
			values: queryParams.location,
		});
	}

	if ('wordpressId' in queryParams) {
		const wordpressId = parseInt(queryParams.wordpressId, 10);

		if (!Number.isNaN(wordpressId)) {
			filters.push({
				key: 'wordpressId',
				values: [wordpressId],
			});
		}
	}

	if ('revision' in queryParams) {
		const revision = parseInt(queryParams.revision, 10);

		if (!Number.isNaN(revision)) {
			filters.push({
				key: 'revision',
				values: [revision],
			});
		}
	}

	if ('urn' in queryParams) {
		filters.push({
			key: 'urn',
			values: [queryParams.urn],
		});
	}

	return filters;
};

/**
 * Get the value of a query param
 */
const _getQueryParamValue = (queryParams, key, value) => {
	let queryParamValue = null;
	if (queryParams[key]) {
		queryParamValue = `${queryParams[key]},${value}`;
	} else {
		queryParamValue = value;
	}

	return queryParamValue;
};

/**
 * Given an input list of filters, create a list of query params to serialize in URL
 */
const _createQueryParamsFromFilters = (filters) => {
	const queryParams = {};
	filters.forEach((filter) => {
		filter.values.forEach((value) => {
			switch (filter.key) {
			case 'works':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.slug);
				break;
			case 'location':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'keyideas':
			case 'keywords':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.slug);
				break;
			case 'commenters':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.slug);
				break;
			case 'textsearch':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'wordpressId':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'reference':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value._id);
				break;
			case '_id':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'urn':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'skip':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'limit':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			default:
				break;
			}
		});
	});

	return queryParams;
};

/**
 * For the line change event, update the line filter
 */
const _updateFilterOnBrowseEvent = (oldFilters, e) => {
	const filters = oldFilters;

	// TODO implement location for browse


	return _resetFiltersPage(filters);
};

/**
 * For the textsearch event, update the textsearch filter
 */
const _updateFilterOnChangeTextSearchEvent = (oldFilters, e, textsearch) => {
	const filters = oldFilters;

	if (textsearch && textsearch.length) {
		let textsearchInFilters = false;

		filters.forEach((filter, i) => {
			if (filter.key === 'textsearch') {
				filters[i].values = [textsearch];
				textsearchInFilters = true;
			}
		});

		if (!textsearchInFilters) {
			filters.push({
				key: 'textsearch',
				values: [textsearch],
			});
		}
	} else {
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === 'textsearch') {
				filterToRemove = i;
			}
		});

		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}
	}

	return _resetFiltersPage(filters);
};

/**
 * General helper function for updating filter based on key/value
 */
const _updateFilterOnKeyAndValueChangeEvent = (oldFilters, key, value) => {
	const filters = oldFilters;

	let keyIsInFilter = false;
	let valueIsInFilter = false;
	let filterValueToRemove;
	let filterToRemove;

	filters.forEach((filter, i) => {
		if (filter.key === key) {
			keyIsInFilter = true;
			valueIsInFilter = false;

			filter.values.forEach((filterValue, j) => {
				if (value._id && filterValue._id === value._id) {
					valueIsInFilter = true;
					filterValueToRemove = j;
				} else if (filterValue.slug === value.slug) {
					valueIsInFilter = true;
					filterValueToRemove = j;
				}
			});

			if (valueIsInFilter) {
				filter.values.splice(filterValueToRemove, 1);
				if (filter.values.length === 0) {
					filterToRemove = i;
				}
			} else if (key === 'works') {
				filters[i].values = [value];
			} else {
				filters[i].values.push(value);
			}
		}
	});


	if (typeof filterToRemove !== 'undefined') {
		filters.splice(filterToRemove, 1);
	}

	if (!keyIsInFilter) {
		filters.push({
			key,
			values: [value],
		});
	}

	return filters;
};


/**
 * Create a list of filters from params
 */
const _createFiltersFromParams = (params, works) => {
	const filters = [];

	if (!params) {
		return filters;
	}

	if ('urn' in params) {
		// TODO: use cts module for filters
	}
	return filters;
};

/**
 * Create a list of filters from URL
 */
const _createFiltersFromURL = (params, queryParams, works, referenceWorks) => {
	let filters = [];
	if (params.urn) {
		filters = _createFiltersFromParams(params, works);
	} else if (queryParams) {
		filters = _createFiltersFromQueryParams(queryParams, referenceWorks);
	}
	return filters;
};

export {
	_createFiltersFromQueryParams as createFiltersFromQueryParams,
	_createQueryParamsFromFilters as createQueryParamsFromFilters,
	_updateFilterOnBrowseEvent as updateFilterOnBrowseEvent,
	_updateFilterOnChangeTextSearchEvent as updateFilterOnChangeTextSearchEvent,
	_updateFilterOnKeyAndValueChangeEvent as updateFilterOnKeyAndValueChangeEvent,
	_createFiltersFromURL as createFiltersFromURL
};
