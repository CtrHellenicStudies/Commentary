import React from 'react';
import PropTypes from 'prop-types';

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
	href: PropTypes.string,
	target: PropTypes.string,
	primaryText: PropTypes.string,
	onClick: PropTypes.func,
};

export default MenuItem;
