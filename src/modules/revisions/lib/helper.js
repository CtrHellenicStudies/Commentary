function handleChangeLineN(e, filters) {

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

function toggleSearchTerm(key, value, filters) {

    let keyIsInFilter = false;
    let valueIsInFilter = false;
    let filterValueToRemove;
    let filterToRemove;

    filters.forEach((filter, i) => {
        if (filter.key === key) {
            keyIsInFilter = true;

            filter.values.forEach((filterValue, j) => {
                if (filterValue._id === value._id) {
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
                filter.values.push(value);
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
    return {
        filters,
        skip: 0,
    };
}
export { 
    handleChangeLineN,
    toggleSearchTerm 
};