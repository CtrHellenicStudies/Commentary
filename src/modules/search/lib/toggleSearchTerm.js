import qs from 'qs-lite';

import {
	createFiltersFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnChangeLineEvent,
	updateFilterOnChangeTextSearchEvent,
	updateFilterOnKeyAndValueChangeEvent,
	createFiltersFromURL
} from '../../comments/lib/queryFilterHelpers';

const toggleSearchTerm = (key, value, history) => {
	const oldFilters = createFiltersFromQueryParams(queryParams);
	const skip = 0;
	const limit = 0;

	// update filter based on the key and value
	const filters = updateFilterOnKeyAndValueChangeEvent(oldFilters, key, value);
	const queryParams = createQueryParamsFromFilters(filters);

	// update route
	const urlParams = qs.stringify(queryParams);

	history.push(`/commentary/?${urlParams}`);
}

export default toggleSearchTerm;
