
/*
	helpers
*/
const isActive = (filters, keyword, key, valueKey = 'slug') => {
	filters.forEach((filter) => {
		if (filter.key === key) {
			filter.values.forEach((value) => {
				if (keyword.slug === value[valueKey]) {
					return true;
				}
			});
		}
	});
	return false;
};

const dropdownPropTypes = {
	searchDropdownOpen: React.PropTypes.string,
	toggleSearchDropdown: React.PropTypes.func.isRequired,
	toggleSearchTerm: React.PropTypes.func.isRequired,
};
const dropdownDefaultProps = {
	searchDropdownOpen: null,
};


/*
	BEGIN KeywordsDropdown
*/
const KeywordsDropdown = ({ keywords, searchDropdownOpen, toggleSearchDropdown, toggleSearchTerm }) => (
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
	keywords: PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
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

export { KeywordsDropdown }; // eslint-disable-line import/prefer-default-export
