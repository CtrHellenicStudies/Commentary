
CommenterWorkVisualization = React.createClass({

	propTypes: {
		work: React.PropTypes.object.isRequired,
		toggleVisibleWork: React.PropTypes.func.isRequired,
		commenterSlug: React.PropTypes.string.isRequired,
	},

	toggleVisibleWork(workSlug) {
		this.props.toggleVisibleWork(workSlug);
		this.refs.workVisualization.close();
	},

	render() {
		const work = this.props.work;

		return (
			<div className={`commenter-work-visualization commenter-work-visualization--${work.slug}`}>
				<i
					onClick={this.toggleVisibleWork.bind(null, work.slug)}
					className="close-visualization mdi mdi-close"
				/>
				<WorkVisualization
					ref='workVisualization'
					work={work}
					commenterSlug={this.props.commenterSlug}
				/>
			</div>
		);
	},
});
