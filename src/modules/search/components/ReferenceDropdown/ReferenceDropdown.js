import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib:
import Utils from '../../../../lib/utils';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from '../../lib/helpers';

/*
	BEGIN ReferenceDropdown
*/
const ReferenceDropdown = ({ reference, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="reference"
		open={searchDropdownOpen === 'reference'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{reference.map(_reference => (
			<SearchTermButton
				key={_reference._id}
				toggleSearchTerm={toggleSearchTerm}
				label={Utils.trunc(_reference.title, 30)}
				searchTermKey="reference"
				value={_reference}
				active={isActive(filters, _reference, 'reference', '_id')}
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
