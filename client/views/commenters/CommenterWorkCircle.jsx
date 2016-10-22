
CommenterWorkCircle = React.createClass({

	propTypes: {
		toggleVisibleWork: React.PropTypes.func.isRequired,
		workTitle: React.PropTypes.string.isRequired,
		workSlug: React.PropTypes.string.isRequired,
		workLevel: React.PropTypes.number.isRequired,
	},

	render() {
		return (
			<div className={`commenter-work-circle circle-level-${this.props.workLevel}`}>
				<div
					className="circle-inner"
					onClick={this.props.toggleVisibleWork.bind(null, this.props.workSlug)}
				>
					<span className="work-title">{this.props.workTitle}</span>
					<div className="grow-border" />
				</div>
			</div>
		);
	},
});
