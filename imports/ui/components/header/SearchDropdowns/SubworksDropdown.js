import React from 'react';

// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown'; // eslint-disable-line import/no-absolute-path
import SearchTermButton from '/imports/ui/components/header/SearchTermButton'; // eslint-disable-line import/no-absolute-path

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

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
						label={`${work.title} ${subwork.title}`}
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
	works: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		subworks: React.PropTypes.arrayOf(React.PropTypes.shape({
			n: React.PropTypes.number.isRequired,
			title: React.PropTypes.string.isRequired,
		})),
	})),
	selectedWork: React.PropTypes.string.isRequired,
	workInFilter: React.PropTypes.bool.isRequired,
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
