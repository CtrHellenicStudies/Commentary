import React from 'react';
import PropTypes from 'prop-types';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib
import isActive from '../../../inputs/lib/isActive';
import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';

/*
	BEGIN WorksDropdown
*/
const WorksDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown }) => (
	<SearchToolDropdown
		name="Work"
		open={searchDropdownOpen === 'Work'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{works.map(work => (
			<SearchTermButton
				key={work.urn}
				label={work.english_title}
				searchTermKey="works"
				value={work}
				active={isActive(work, 'works')}
			/>
		))}
	</SearchToolDropdown>
);
WorksDropdown.propTypes = {
	works: PropTypes.arrayOf(PropTypes.shape({
		urn: PropTypes.string.isRequired,
		english_title: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
WorksDropdown.defaultProps = {
	works: [],
	...dropdownDefaultProps,
};
/*
	END WorksDropdown
*/

export default WorksDropdown;
