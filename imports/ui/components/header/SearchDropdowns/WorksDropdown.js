
// components:
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown'; // eslint-disable-line import/no-absolute-path
import SearchTermButton from '/imports/ui/components/header/SearchTermButton'; // eslint-disable-line import/no-absolute-path

// helpers:
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN WorksDropdown
*/
const WorksDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="Work"
		open={searchDropdownOpen === 'Work'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{works.map(work => (
			<SearchTermButton
				key={work._id}
				toggleSearchTerm={toggleSearchTerm}
				label={work.title}
				searchTermKey="works"
				value={work}
				activeWork={isActive(filters, work, 'works')}
			/>
		))}
	</SearchToolDropdown>
);
WorksDropdown.propTypes = {
	works: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
WorksDropdown.defaultProps = {
	works: [],
	...dropdownDefaultProps,
};
/*
	END WorksDropdown
*/

export default WorksDropdown;
