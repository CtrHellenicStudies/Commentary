import PropTypes from 'prop-types';

const dropdownPropTypes = {
	toggleSearchDropdown: PropTypes.func.isRequired,
	searchDropdownOpen: PropTypes.string,
};

const dropdownDefaultProps = {
	searchDropdownOpen: null,
};

export { dropdownPropTypes, dropdownDefaultProps };
export default dropdownPropTypes;
