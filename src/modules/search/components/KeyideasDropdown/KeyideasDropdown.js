import React from 'react';
import PropTypes from 'prop-types';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib
import isActive from '../../../inputs/lib/isActive';
import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';

/*
	BEGIN KeyideasDropdown
*/
const KeyideasDropdown = ({ keyideas, searchDropdownOpen, toggleSearchDropdown }) => (
	<SearchToolDropdown
		name="Ideas"
		open={searchDropdownOpen === 'Ideas'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{keyideas.map(keyidea => (
			<SearchTermButton
				key={keyidea._id}
				label={keyidea.title}
				searchTermKey="keyideas"
				value={keyidea}
				active={isActive(keyidea, 'keyideas')}
			/>
		))}
	</SearchToolDropdown>
);
KeyideasDropdown.propTypes = {
	keyideas: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
KeyideasDropdown.defaultProps = {
	keyideas: [],
	...dropdownDefaultProps,
};
/*
	END KeyideasDropdown
*/

export default KeyideasDropdown;
