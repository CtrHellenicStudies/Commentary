import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '../../../../components/header/search/SearchToolDropdown';
import SearchTermButton from '../../../../components/header/search/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from '../helpers';

/*
	BEGIN WorksDropdown
*/
const WorksDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="Work"
		open={searchDropdownOpen === 'Work'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{works.map(work => (
			<SearchTermButton
				key={work._id}
				toggleSearchTerm={toggleSearchTerm}
				label={work.title}
				searchTermKey="works"
				value={work}
				activeWork={isActive(filters, work, 'works')}
			/>
		))}
	</SearchToolDropdown>
);
WorksDropdown.propTypes = {
	works: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
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
