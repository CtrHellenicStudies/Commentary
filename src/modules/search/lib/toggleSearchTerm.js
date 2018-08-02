import qs from 'qs-lite';

import {
	createFiltersFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnKeyAndValueChangeEvent,
} from '../../comments/lib/queryFilterHelpers';

const toggleSearchTerm = (key, value, history) => {
	let queryParams = qs.parse(window.location.search);
	const oldFilters = createFiltersFromQueryParams(queryParams);

	// update filter based on the key and value
	const filters = updateFilterOnKeyAndValueChangeEvent(oldFilters, key, value);
	queryParams = createQueryParamsFromFilters(filters);
	queryParams.page = 0;

	// update route
	const urlParams = qs.stringify(queryParams);

	history.push(`/commentary/?${urlParams}`);
}

export default toggleSearchTerm;
