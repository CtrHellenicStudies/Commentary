import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// lib
import toggleSearchTerm from '../../lib/toggleSearchTerm';


const SearchTermButtonPanel = ({ active, activeWork, label, searchTermKey, value, history }) => (
	<button
		className={`search-term-button ${(active || activeWork) ? 'search-term-button--active' : ''}`}
		onClick={toggleSearchTerm.bind(this, searchTermKey, value, history)}
	>
		<span>{label}</span>
	</button>
);

SearchTermButtonPanel.propTypes = {
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


export default withRouter(SearchTermButtonPanel);
