import React from 'react';
import PropTypes from 'prop-types';

const Spinner = React.createClass({

	propTypes: {
		fullPage: PropTypes.bool,
	},

	render() {
		let className = 'ahcip-spinner commentary-loading';
		if (this.props.fullPage) {
			className += ' full-page-spinner';
		}
		return (
			<div className={className} >
				<div className="double-bounce1" />
				<div className="double-bounce2" />
			</div>
		);
	},
});

export default Spinner;
