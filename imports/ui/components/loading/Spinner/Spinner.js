import React from 'react';

const Spinner = React.createClass({

	propTypes: {
		fullPage: React.PropTypes.bool,
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
