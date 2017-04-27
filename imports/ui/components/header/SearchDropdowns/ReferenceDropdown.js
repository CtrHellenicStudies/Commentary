import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN ReferenceDropdown
*/
const ReferenceDropdown = ({ reference, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="reference"
		open={searchDropdownOpen === 'reference'}
		toggle={toggleSearchDropdown}
		disabled={false}
	>
		{reference.map(reference => (
			<SearchTermButton
				key={reference._id}
				toggleSearchTerm={toggleSearchTerm}
				label={Utils.trunc(reference.title, 30)}
				searchTermKey="reference"
				value={reference}
				active={isActive(filters, reference, 'reference', 'title')}
			/>
		))}
	</SearchToolDropdown>
);
ReferenceDropdown.propTypes = {
	reference: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
ReferenceDropdown.defaultProps = {
	keyideas: [],
	...dropdownDefaultProps,
};
/*
	END ReferenceDropdown
*/

export default ReferenceDropdown;