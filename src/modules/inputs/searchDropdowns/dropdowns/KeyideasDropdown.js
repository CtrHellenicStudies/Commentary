import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '../../../../components/header/SearchToolDropdown';
import SearchTermButton from '../../../../components/header/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from '../helpers';

/*
	BEGIN KeyideasDropdown
*/
const KeyideasDropdown = ({ keyideas, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="Ideas"
		open={searchDropdownOpen === 'Ideas'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{keyideas.map(keyidea => (
			<SearchTermButton
				key={keyidea._id}
				toggleSearchTerm={toggleSearchTerm}
				label={keyidea.title}
				searchTermKey="keyideas"
				value={keyidea}
				active={isActive(filters, keyidea, 'keyideas')}
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
