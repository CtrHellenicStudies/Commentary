import PropTypes from 'prop-types';

/*
	helpers
*/
const isActive = (filters, element, key, valueKey = 'slug') => {
	let isActiveVar = false;
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

const dropdownPropTypes = {
	searchDropdownOpen: PropTypes.string,
	toggleSearchDropdown: PropTypes.func.isRequired,
	toggleSearchTerm: PropTypes.func.isRequired,
	filters: PropTypes.any,
};

const dropdownDefaultProps = {
	searchDropdownOpen: null,
	filters: [],
};


const helpers = {
	isActive,
	dropdownPropTypes,
	dropdownDefaultProps,
};

export { isActive, dropdownPropTypes, dropdownDefaultProps };
export default helpers;
