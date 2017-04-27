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
	searchDropdownOpen: React.PropTypes.string,
	toggleSearchDropdown: React.PropTypes.func.isRequired,
	toggleSearchTerm: React.PropTypes.func.isRequired,
	filters: React.PropTypes.any,
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
