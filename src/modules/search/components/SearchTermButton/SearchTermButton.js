import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
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


const SearchTermButton = ({ toggleSearchTerm, label, searchTermKey, value, activeWork, active, history }) => (
	<li>
		<button
			className={getClassName(active, activeWork)}
			onClick={toggleSearchTerm.bind(null, searchTermKey, value, history)}
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
	toggleSearchTerm: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	searchTermKey: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	activeWork: PropTypes.bool,
	active: PropTypes.bool,
};
SearchTermButton.defaultProps = {
	activeWork: false,
	active: false,
};

export default withRouter(SearchTermButton);
