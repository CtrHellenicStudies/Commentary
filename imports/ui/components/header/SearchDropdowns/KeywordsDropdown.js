import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown';
import SearchTermButton from '/imports/ui/components/header/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN KeywordsDropdown
*/
const KeywordsDropdown = ({ keywords, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="Words"
		open={searchDropdownOpen === 'Words'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{keywords.map(keyword => (
			<SearchTermButton
				key={keyword._id}
				toggleSearchTerm={toggleSearchTerm}
				label={keyword.title}
				searchTermKey="keywords"
				value={keyword}
				active={isActive(filters, keyword, 'keywords')}
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
