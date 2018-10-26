import qs from 'qs-lite';

// lib
import {
	createFiltersFromQueryParams,
} from '../../comments/lib/queryFilterHelpers';


/**
 * Check if a given search filter is active
 */
const isActive = (element, key, valueKey = 'slug') => {
	let isActiveVar = false;
	const queryParams = qs.parse(window.location.search.replace('?', ''));
	const filters = createFiltersFromQueryParams(queryParams);

	filters.forEach((filter) => {
		if (filter.key === key) {
			filter.values.forEach((value) => {
				if (element[valueKey] === value[valueKey]) {
					isActiveVar = true;
				}
			});
		}
	});
	return isActiveVar;
};


export default isActive;
