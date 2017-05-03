import React from 'react';
import stylePropType from 'react-style-proptype'

/*
	helpers
*/
const isActive = (filters, element, key, valueKey = 'slug') => {
	let isActiveVar = false;
	filters.forEach((filter) => {
		if (filter.key === key) {
			filter.values.forEach((value) => {
				if (element.slug === value[valueKey]) {
					isActiveVar = true;
				}
			});
		}
	});
	return isActiveVar;
};

const dropdownPropTypes = {
	toggleWorkSearchTerm: React.PropTypes.func.isRequired,
	styles: React.PropTypes.shape({
		cardHeader: stylePropType.isRequired,
		wrapper: stylePropType.isRequired,
	}).isRequired,
	filters: React.PropTypes.any,
};

const dropdownDefaultProps = {
	filters: [],
};


const helpers = {
	isActive,
	dropdownPropTypes,
	dropdownDefaultProps,
};

export { isActive, dropdownPropTypes, dropdownDefaultProps };
export default helpers;
