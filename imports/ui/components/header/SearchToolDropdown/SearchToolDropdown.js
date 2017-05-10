import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const SearchToolDropdown = ({ name, children, open, toggle, disabled }) => (
	<div className={`dropdown search-dropdown search-dropdown--${name.replace(' ', '')} ${open ? 'open' : ''}`}>
		<FlatButton
			className={`search-tool dropdown-toggle ${disabled
				? 'search-tool-disabled' : ''}`}
			label={name}
			labelPosition="before"
			icon={<FontIcon className="mdi mdi-chevron-down" />}
			onClick={() => {
				toggle(name);
			}}
			disabled={disabled}
		/>

		<ul className="dropdown-menu">
			<div className="dropdown-menu-inner">
				{children}
			</div>

			<IconButton
				className="close-dropdown"
				iconClassName="mdi mdi-close"
				onClick={() => {
					toggle(name);
				}}
			/>
		</ul>
	</div>
);
SearchToolDropdown.propTypes = {
	name: React.PropTypes.string.isRequired, // name of the dropdown option
	children: React.PropTypes.node.isRequired, // content to show inside dropdown
	open: React.PropTypes.bool.isRequired, // whether dropdown is open or not
	toggle: React.PropTypes.func.isRequired, // function to toggle the dropdown
	disabled: React.PropTypes.bool, // whether dropdown is disabled or not
};
SearchToolDropdown.defaultProps = {
	disabled: false,
};

export default SearchToolDropdown;
