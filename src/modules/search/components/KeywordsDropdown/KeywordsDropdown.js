import React from 'react';
import PropTypes from 'prop-types';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib
import isActive from '../../../inputs/lib/isActive';
import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';

/*
	BEGIN KeywordsDropdown
*/
const KeywordsDropdown = ({ keywords, searchDropdownOpen, toggleSearchDropdown }) => (
	<SearchToolDropdown
		name="Words"
		open={searchDropdownOpen === 'Words'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{keywords.map(keyword => (
			<SearchTermButton
				key={keyword._id}
				label={keyword.title}
				searchTermKey="keywords"
				value={keyword}
				active={isActive(keyword, 'keywords')}
			/>
		))}
	</SearchToolDropdown>
);
KeywordsDropdown.propTypes = {
	keywords: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
KeywordsDropdown.defaultProps = {
	keywords: [],
	...dropdownDefaultProps,
};
/*
	END KeywordsDropdown
*/

export default KeywordsDropdown;
