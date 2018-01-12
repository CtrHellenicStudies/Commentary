import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown';
import SearchTermButton from '/imports/ui/components/header/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN SectionsDropdown
*/
const SectionsDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, selectedWork, workInFilter, filters }) => (
	<SearchToolDropdown
		name="Section"
		open={searchDropdownOpen === 'Section'}
		toggle={toggleSearchDropdown}
		disabled={!workInFilter}
	>
		{
			_.range(1, 127).map(section => (
				<SearchTermButton
					key={section}
					toggleSearchTerm={toggleSearchTerm}
					label={section.toString()}
					searchTermKey="sections"
					value={section}
					active={isActive(filters, section, 'sections', 'n')}
				/>
			))
		}
	</SearchToolDropdown>
);

SectionsDropdown.propTypes = {
	...dropdownPropTypes,
	workInFilter: PropTypes.bool.isRequired,
};

SectionsDropdown.defaultProps = {

	...dropdownDefaultProps,
};

/*
	END SectionsDropdown
*/

export default SectionsDropdown;
