import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const Button = (props) => {

	const { to, onClick, light, transparentLight, dark, primary, accent, outline, classes } = props;
	const _classes = classes || [];

	_classes.push('chs-button');

	if (primary) {
		_classes.push('chs-button--primary');
	} else if (accent) {
		_classes.push('chs-button--accent');
	} else if (light) {
		_classes.push('chs-button--light');
	} else if (transparentLight) {
		_classes.push('chs-button--trans-light');
	} else if (dark) {
		_classes.push('chs-button--dark');
	}

	if (outline) {
		_classes.push('chs-button--outline');
	}

	return (
		<Link
			to={to}
			onClick={onClick}
			className={_classes.join(' ')}
		>
			{props.children}
		</Link>
	);
};

Button.propTypes = {
	to: PropTypes.string,
	onClick: PropTypes.func,
	light: PropTypes.bool,
	transparentLight: PropTypes.bool,
	primary: PropTypes.bool,
	accent: PropTypes.bool,
	outline: PropTypes.bool,
	children: PropTypes.node,
};

export default Button;
