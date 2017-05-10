import React from 'react';

const styles = {
	menuItem: {
		width: '100%',
		display: 'block',
		padding: '15px 15px',
		fontSize: '16px',
	},
};

const MenuItem = ({ href, target, primaryText, onClick }) => (
	<a
		className="menu-item"
		href={href}
		target={target}
		onClick={onClick}
		style={styles.menuItem}
	>
		{primaryText}
	</a>
);

MenuItem.propTypes = {
	href: React.PropTypes.string,
	target: React.PropTypes.string,
	primaryText: React.PropTypes.string,
	onClick: React.PropTypes.func,
};

export default MenuItem;
