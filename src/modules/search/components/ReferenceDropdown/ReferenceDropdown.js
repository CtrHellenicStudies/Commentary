import React from 'react';
import PropTypes from 'prop-types';
import _s from 'underscore.string';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib
import isActive from '../../../inputs/lib/isActive';
import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';

/*
	BEGIN ReferenceDropdown
*/
const ReferenceDropdown = ({ reference, searchDropdownOpen, toggleSearchDropdown }) => (
	<SearchToolDropdown
		name="reference"
		open={searchDropdownOpen === 'reference'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{reference.map(_reference => (
			<SearchTermButton
				key={_reference._id}
				label={_s.truncate(_reference.title, 30)}
				searchTermKey="reference"
				value={_reference}
				active={isActive(_reference, 'reference', '_id')}
			/>
		))}
	</SearchToolDropdown>
);
ReferenceDropdown.propTypes = {
	reference: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
ReferenceDropdown.defaultProps = {
	reference: [],
	...dropdownDefaultProps,
};
/*
	END ReferenceDropdown
*/

export default ReferenceDropdown;
