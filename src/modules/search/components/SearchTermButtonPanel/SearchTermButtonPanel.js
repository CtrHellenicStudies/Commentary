import React from 'react';
import PropTypes from 'prop-types';

/*
	helpers
*/
const getClassName = (active, activeWork) => {
	let className = 'search-term-button';

	if (active || activeWork) className += ' search-term-button--active';

	return className;
};


/*
	BEGIN SearchTermButtonPanel
*/
const SearchTermButtonPanel = ({ active, activeWork, toggleSearchTerm, label, searchTermKey, value }) => (
	<button
		className={getClassName(active, activeWork)}
		onClick={toggleSearchTerm.bind(null, searchTermKey, value)}
	>
		<span>{label}</span>
	</button>
);
SearchTermButtonPanel.propTypes = {
	toggleSearchTerm: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	searchTermKey: PropTypes.string.isRequired,
	value: PropTypes.shape({}).isRequired,
	active: PropTypes.bool,
	activeWork: PropTypes.bool,
};
SearchTermButtonPanel.defaultProps = {
	active: false,
	activeWork: false,
};
/*
	END SearchTermButtonPanel
*/

export default SearchTermButtonPanel;
