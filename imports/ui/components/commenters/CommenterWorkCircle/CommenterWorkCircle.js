import React from 'react';

const CommenterWorkCircle = React.createClass({

	propTypes: {
		toggleVisibleWork: React.PropTypes.func.isRequired,
		workTitle: React.PropTypes.string.isRequired,
		workSlug: React.PropTypes.string.isRequired,
		workLevel: React.PropTypes.number.isRequired,
		nComments: React.PropTypes.number.isRequired,
	},

	render() {
		return (
			<div className="commenter-work-circle">
				<div
					className={`circle-inner circle-level-${this.props.workLevel}`}
					onClick={this.props.toggleVisibleWork.bind(null, this.props.workSlug)}
				>
					<span className="work-title">{this.props.workTitle}</span>
					<span className="work-count">{this.props.nComments}</span>
					<div className="grow-border" />
				</div>
			</div>
		);
	},
});

export default CommenterWorkCircle;
