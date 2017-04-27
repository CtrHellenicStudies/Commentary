
/*
	helpers
*/
const getClassName = (active) => {
	let className = 'search-term-button';

	if (active) className += ' search-term-button--active';

	return className;
};


/*
	BEGIN SearchTermButtonPanel
*/
const SearchTermButtonPanel = ({ active, toggleSearchTerm, label, searchTermKey, value }) => (
	<button
		className={getClassName(active)}
		onClick={toggleSearchTerm.bind(null, searchTermKey, value)}
	>
		<span>{label}</span>
	</button>
);
SearchTermButtonPanel.propTypes = {
	toggleSearchTerm: React.PropTypes.func.isRequired,
	label: React.PropTypes.string.isRequired,
	searchTermKey: React.PropTypes.string.isRequired,
	value: React.PropTypes.shape({}).isRequired,
	active: React.PropTypes.bool,
};
SearchTermButtonPanel.defaultProps = {
	active: false,
};
/*
	END SearchTermButtonPanel
*/

export default SearchTermButtonPanel;
