import React from 'react';

// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown';
import SearchTermButton from '/imports/ui/components/header/SearchTermButton';

// lib:
import Utils from '/imports/lib/utils';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

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
				active={isActive(filters, _reference, 'reference', 'title')}
			/>
		))}
	</SearchToolDropdown>
);
ReferenceDropdown.propTypes = {
	reference: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
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
