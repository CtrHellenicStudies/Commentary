import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

// lib
import toggleSearchTerm from '../../lib/toggleSearchTerm';


const SearchTermButton = ({ label, searchTermKey, value, active, history }) => (
	<li>
		<button
			className={`search-term-button ${(active) ? 'search-term-button--active' : ''}`}
			onClick={toggleSearchTerm.bind(this, searchTermKey, value, history)}
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
	label: PropTypes.string.isRequired,
	searchTermKey: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	active: PropTypes.bool,
};

SearchTermButton.defaultProps = {
	active: false,
};

export default withRouter(SearchTermButton);
