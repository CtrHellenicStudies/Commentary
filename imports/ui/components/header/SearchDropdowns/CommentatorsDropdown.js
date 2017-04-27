import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN CommentatorsDropdown
*/
const CommentatorsDropdown = ({ commenters, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
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
CommentatorsDropdown.propTypes = {
	commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	...dropdownPropTypes,
};
CommentatorsDropdown.defaultProps = {
	keyideas: [],
	...dropdownDefaultProps,
};
/*
	END CommentatorsDropdown
*/

export default CommentatorsDropdown;
