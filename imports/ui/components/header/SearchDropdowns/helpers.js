/*
	helpers
*/
const isActive = (filters, keyword, key, valueKey = 'slug') => {
	filters.forEach((filter) => {
		if (filter.key === key) {
			filter.values.forEach((value) => {
				if (keyword.slug === value[valueKey]) {
					return true;
				}
			});
		}
	});
	return false;
};

const dropdownPropTypes = {
	searchDropdownOpen: React.PropTypes.string,
	toggleSearchDropdown: React.PropTypes.func.isRequired,
	toggleSearchTerm: React.PropTypes.func.isRequired,
};

const dropdownDefaultProps = {
	searchDropdownOpen: null,
};


const helpers = {
	isActive,
	dropdownPropTypes,
	dropdownDefaultProps,
};

export { isActive, dropdownPropTypes, dropdownDefaultProps };
export default helpers;
