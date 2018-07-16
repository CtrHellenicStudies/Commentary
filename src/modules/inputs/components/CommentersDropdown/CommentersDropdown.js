import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '../../../../components/header/search/SearchToolDropdown';
import SearchTermButton from '../../../../components/header/search/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from '../helpers';

/*
	BEGIN CommentersDropdown
*/
const CommentersDropdown = ({
	commenters, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters
}) => (
	<SearchToolDropdown
		name="Commentator"
		open={searchDropdownOpen === 'Commentator'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{commenters.map(commenter => (
			<SearchTermButton
				key={commenter._id}
				toggleSearchTerm={toggleSearchTerm}
				label={commenter.name}
				searchTermKey="commenters"
				value={commenter}
				active={isActive(filters, commenter, 'commenters')}
			/>
		))}
	</SearchToolDropdown>
);

CommentersDropdown.propTypes = {
	commenters: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};

CommentersDropdown.defaultProps = {
	commenters: [],
	...dropdownDefaultProps,
};
/*
	END CommentersDropdown
*/

export default CommentersDropdown;
