const _createFilterFromQueryParams = (queryParams) => {
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
		const { referenceWorks } = this.props;

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
				title: Utils.capitalize(work),
			});
		});

		filters.push({
			key: 'works',
			values: works,
		});
	}

	if ('subworks' in queryParams) {
		const subworks = [];

		queryParams.subworks.split(',').forEach((subwork) => {
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

	return filters;
};

const _getQueryParamValue = (queryParams, key, value) => {
	let queryParamValue = null;
	if (queryParams[key]) {
		queryParamValue = `${queryParams[key]},${value}`;
	} else {
		queryParamValue = value;
	}

	return queryParamValue;
};

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
			default:
				break;
			}
		});
	});

	return queryParams;
};

const _updateFilterOnChangeLineEvent = (oldFilters, e) => {
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

	return filters;
};

const _updateFilterOnChangeTextSearchEvent = (oldFilters, e) => {
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

	return filters;
};

const _updateFilterOnCKeyAndValueChangeEvent = (oldFilters, key, value) => {
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

export { 
	_createFilterFromQueryParams as createFilterFromQueryParams,
	_createQueryParamsFromFilters as createQueryParamsFromFilters,
	_updateFilterOnChangeLineEventa as updateFilterOnChangeLineEvent
	_updateFilterOnChangeTextSearchEvent as updateFilterOnChangeTextSearchEvent
	_updateFilterOnCKeyAndValueChangeEvent as updateFilterOnCKeyAndValueChangeEvent
};
