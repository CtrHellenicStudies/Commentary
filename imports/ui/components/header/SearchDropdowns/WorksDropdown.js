import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN WorksDropdown
*/
const WorksDropdown = ({ works, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm }) => (
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
	works: PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
WorksDropdown.defaultProps = {
	keywords: [],
	...dropdownDefaultProps,
};
/*
	END WorksDropdown
*/

export default WorksDropdown;
