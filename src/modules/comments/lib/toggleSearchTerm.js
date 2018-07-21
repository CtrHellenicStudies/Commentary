
import {
	createFiltersFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnChangeLineEvent,
	updateFilterOnChangeTextSearchEvent,
	updateFilterOnKeyAndValueChangeEvent,
	createFiltersFromURL
} from '../../lib/queryFilterHelpers';

const toggleSearchTerm = (key, value, router) => {
	const queryParams = qs.parse(window.location.search.substr(1));
	const oldFilters = createFiltersFromQueryParams(queryParams);
  const skip = 0;
  const limit = 0;

	// update filter based on the key and value
	// const filters = updateFilterOnKeyAndValueChangeEvent(oldFilters, key, value);


}

export default toggleSearchTerm;
