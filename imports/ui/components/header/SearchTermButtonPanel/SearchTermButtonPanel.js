import React from 'react';

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
	toggleSearchTerm: React.PropTypes.func.isRequired,
	label: React.PropTypes.string.isRequired,
	searchTermKey: React.PropTypes.string.isRequired,
	value: React.PropTypes.shape({}).isRequired,
	active: React.PropTypes.bool,
	activeWork: React.PropTypes.bool,
};
SearchTermButtonPanel.defaultProps = {
	active: false,
	activeWork: false,
};
/*
	END SearchTermButtonPanel
*/

export default SearchTermButtonPanel;
