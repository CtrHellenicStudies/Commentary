import React from 'react';
import PropTypes from 'prop-types';

// components
import SearchToolDropdown from '../SearchToolDropdown';
import SearchTermButton from '../SearchTermButton';

// lib
import isActive from '../../../inputs/lib/isActive';
import dropdownPropTypes, { dropdownDefaultProps } from '../../../inputs/lib/dropdownProps';

/*
	BEGIN CommentatorsDropdown
*/
const CommentatorsDropdown = ({ commenters, searchDropdownOpen, toggleSearchDropdown }) => (
	<SearchToolDropdown
		name="Commentator"
		open={searchDropdownOpen === 'Commentator'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{commenters.map(commenter => (
			<SearchTermButton
				key={commenter._id}
				label={commenter.name}
				searchTermKey="commenters"
				value={commenter}
				active={isActive(commenter, 'commenters')}
			/>
		))}
	</SearchToolDropdown>
);
CommentatorsDropdown.propTypes = {
	commenters: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
CommentatorsDropdown.defaultProps = {
	commenters: [],
	...dropdownDefaultProps,
};
/*
	END CommentatorsDropdown
*/

export default CommentatorsDropdown;
