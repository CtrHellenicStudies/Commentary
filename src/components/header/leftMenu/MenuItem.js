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
	{...href ? 
		(<a
			className="menu-item"
			href={href}
			target={target}
			onClick={onClick}
			style={styles.menuItem}
		>
			{primaryText}
		</a>)
		 :
	(<span
		className="menu-item"
		target={target}
		onClick={onClick}
		style={styles.menuItem}
	>
		{primaryText}
	</span>)
	}
);

MenuItem.propTypes = {
	href: PropTypes.string,
	target: PropTypes.string,
	primaryText: PropTypes.string,
	onClick: PropTypes.func,
};

export default MenuItem;
