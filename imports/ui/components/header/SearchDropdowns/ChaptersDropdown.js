import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown';
import SearchTermButton from '/imports/ui/components/header/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN ChaptersDropdown
*/
const ChaptersDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, selectedWork, workInFilter, filters }) => (
	<SearchToolDropdown
		name="Chapter"
		open={searchDropdownOpen === 'Chapter'}
		toggle={toggleSearchDropdown}
		disabled={!workInFilter}
	>
		{
			_.range(1, 127).map(section => (
				<SearchTermButton
					key={section}
					toggleSearchTerm={toggleSearchTerm}
					label={section.toString()}
					searchTermKey="chapters"
					value={section}
					active={isActive(filters, {n: section}, 'chapters', 'n')}
				/>
			))
		}
	</SearchToolDropdown>
);

ChaptersDropdown.propTypes = {
	...dropdownPropTypes,
	workInFilter: PropTypes.bool.isRequired,
};

ChaptersDropdown.defaultProps = {

	...dropdownDefaultProps,
};

/*
	END ChaptersDropdown
*/

export default ChaptersDropdown;
