import React from 'react';
import FontIcon from 'material-ui/FontIcon';

/*
	helpers
*/
const getClassName = (active, activeWork) => {
	let className = 'search-term-button';

	if (active || activeWork) {
		className += ' search-term-button--active';
	}

	return className;
};


const SearchTermButton = ({ toggleSearchTerm, label, searchTermKey, value, activeWork, active }) => (
	<li>
		<button
			className={getClassName(active, activeWork)}
			onClick={toggleSearchTerm.bind(null, searchTermKey, value)}
		>
			<span className="search-term-button-label">
				{label}
			</span>
			<FontIcon
				className="mdi mdi-plus-circle-outline search-term-button-icon"
			/>
		</button>
	</li>
);
SearchTermButton.propTypes = {
	toggleSearchTerm: React.PropTypes.func.isRequired,
	label: React.PropTypes.string.isRequired,
	searchTermKey: React.PropTypes.string.isRequired,
	value: React.PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	activeWork: React.PropTypes.bool,
	active: React.PropTypes.bool,
};
SearchTermButton.defaultProps = {
	activeWork: false,
	active: false,
};

export default SearchTermButton;
