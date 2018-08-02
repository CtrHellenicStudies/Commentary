import _s from 'underscore.string'; 

/**
 * reset the skip and limit of the filters
 */
const _resetFiltersSkipLimit = _filters => {
	const filters = _filters.slice();
	if (filters.some(filter => (filter.key === 'skip'))) {
		filters.forEach(filter => {
			if (filter.key === 'skip') {
				filter.values = [0];
			}
		});
	} else {
		filters.push({
			key: 'skip',
			values: [0],
		});
	}

	if (filters.some(filter => (filter.key === 'limit'))) {
		filters.forEach(filter => {
			if (filter.key === 'limit') {
				filter.values = [10];
			}
		});
	} else {
		filters.push({
			key: 'limit',
			values: [10],
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

	if ('subworks' in queryParams) {
		// console.log('current query params: ', queryParams);
		const subworks = [];

		new Set(queryParams.subworks.split(',')).forEach((subwork) => {
			const subworkNumber = parseInt(subwork, 10);

			if (!Number.isNaN(subworkNumber)) {
				subworks.push({
					title: subwork,
					n: subworkNumber,
				});
			}
		});


		filters.push({
			key: 'subworks',
			values: subworks,
		});
	}

	if ('lineFrom' in queryParams) {
		const lineFrom = parseInt(queryParams.lineFrom, 10);

		if (!Number.isNaN(lineFrom)) {
			filters.push({
				key: 'lineFrom',
				values: [lineFrom],
			});
		}
	}

	if ('lineTo' in queryParams) {
		const lineTo = parseInt(queryParams.lineTo, 10);

		if (!Number.isNaN(lineTo)) {
			filters.push({
				key: 'lineTo',
				values: [lineTo],
			});
		}
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
			case 'subworks':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.title);
				break;
			case 'keyideas':
			case 'keywords':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.slug);
				break;
			case 'commenters':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value.slug);
				break;
			case 'lineFrom':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
				break;
			case 'lineTo':
				queryParams[filter.key] = _getQueryParamValue(queryParams, filter.key, value);
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

	if (e.from > 1) {
		let lineFromInFilters = false;

		filters.forEach((filter, i) => {
			if (filter.key === 'lineFrom') {
				filters[i].values = [e.from];
				lineFromInFilters = true;
			}
		});

		if (!lineFromInFilters) {
			filters.push({
				key: 'lineFrom',
				values: [e.from],
			});
		}
	} else {
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === 'lineFrom') {
				filterToRemove = i;
			}
		});

		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}
	}

	if (e.to < 1000) {
		let lineToInFilters = false;

		filters.forEach((filter, i) => {
			if (filter.key === 'lineTo') {
				filters[i].values = [e.to];
				lineToInFilters = true;
			}
		});

		if (!lineToInFilters) {
			filters.push({
				key: 'lineTo',
				values: [e.to],
			});
		}
	} else {
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === 'lineTo') {
				filterToRemove = i;
			}
		});

		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}
	}


	return _resetFiltersSkipLimit(filters);
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

	return _resetFiltersSkipLimit(filters);
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
 * DEPRECATED and should be replaced where used by cts module
 * Verify if cts urn is valid
 */
const _splitUrnIsOk = (splitURN) => {
	if (splitURN instanceof Array) {
		if (splitURN[0] === 'urn'
			&& splitURN[1] === 'cts'
			&& splitURN[2] === 'greekLit'
		) {
			return true;
		}
	}
	return false;
};

/**
 * DEPRECATED and should be replaced where used by cts module
 * get filters from parsing a urn
 */
const _getUrnFilters = (urn, works) => {
	const splitURN = urn.split(/[:.]/);
	// console.log('splitURN', splitURN);

	const urnFilters = [];

	if (_splitUrnIsOk(splitURN)) {

		const filterValues = {};

		if (splitURN[4]) {
			const workTlg = splitURN[4];
			const _work = works.find(work => work.tlg === workTlg);
			if (_work) filterValues.works = _work;
		}
		if (splitURN[5] && filterValues.works) {
			filterValues.subworks = {
				n: Number(splitURN[5]),
				title: Number(splitURN[5]).toString(),
			};
		}
		if (splitURN[6]) {
			const lines = splitURN[6].split('-');
			if (lines.length === 2) {
				filterValues.lineFrom = Number(lines[0]);
				filterValues.lineTo = Number(lines[1]);
			} else if (lines.length === 1) {
				filterValues.lineFrom = Number(lines[0]);
				filterValues.lineTo = 909;
			}
		}
		if (splitURN[7]) {
			const _id = splitURN[7];
			filterValues._id = _id;
		}
		if (splitURN[8]) {
			const revision = splitURN[8];
			filterValues.revision = revision;
		}
		Object.keys(filterValues).forEach(key => urnFilters.push({
			key,
			values: [filterValues[key]],
		}));
	}

	return urnFilters;
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
		const urnFilters = _getUrnFilters(params.urn, works);

		if (urnFilters.length) {
			urnFilters.forEach((urnFilter) => {
				filters.push(urnFilter);
			});
		}
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
