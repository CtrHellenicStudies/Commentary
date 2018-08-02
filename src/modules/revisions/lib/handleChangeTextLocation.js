
/**
 * Change the text location in the reading or commentary interface
 */
const handleChangeTextLocation = (e, filters) => {

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

	if (e.to < 2100) {
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
}

export default handleChangeTextLocation;
