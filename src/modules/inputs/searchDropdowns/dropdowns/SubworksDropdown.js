import React from 'react';
import PropTypes from 'prop-types';

// components:
import SearchToolDropdown from '../../../../components/header/SearchToolDropdown';
import SearchTermButton from '../../../../components/header/SearchTermButton';

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from '../helpers';

/*
	BEGIN SubworksDropdown
*/
const SubworksDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, selectedWork, workInFilter, filters }) => (
	<SearchToolDropdown
		name={selectedWork}
		open={searchDropdownOpen === 'Book' || searchDropdownOpen === 'Hymn'}
		toggle={toggleSearchDropdown}
		disabled={!workInFilter}
	>
		{works.map((work) => {
			const workIsAvtive = isActive(filters, work, 'works');
			if (workIsAvtive) {
				const SearchTermButtons = work.subworks.map(subwork => (
					<SearchTermButton
						key={subwork.n}
						toggleSearchTerm={toggleSearchTerm}
						label={work.title === 'Homeric Hymns' ? `Hymn ${subwork.title}` : `${work.title} ${subwork.title}`}
						searchTermKey="subworks"
						value={subwork}
						active={isActive(filters, subwork, 'subworks', 'n')}
					/>
				));
				return SearchTermButtons;
			}
			return null;
		})}
	</SearchToolDropdown>
);
SubworksDropdown.propTypes = {
	works: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		subworks: PropTypes.arrayOf(PropTypes.shape({
			n: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
		})),
	})),
	selectedWork: PropTypes.string.isRequired,
	workInFilter: PropTypes.bool.isRequired,
	...dropdownPropTypes,
};
SubworksDropdown.defaultProps = {
	works: [],
	...dropdownDefaultProps,
};
/*
	END SubworksDropdown
*/

export default SubworksDropdown;
