import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown'; // eslint-disable-line import/no-absolute-path
import SearchTermButton from '/imports/ui/components/header/SearchTermButton'; // eslint-disable-line import/no-absolute-path
import { isActive, dropdownPropTypes, dropdownDefaultProps } from './helpers';

/*
	BEGIN KeywordsDropdown
*/
const KeywordsDropdown = ({ keywords, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm, filters }) => (
	<SearchToolDropdown
		name="Keywords"
		open={searchDropdownOpen === 'Keywords'}
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
	keywords: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
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
