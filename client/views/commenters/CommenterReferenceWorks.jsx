
CommenterReferenceWorks = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	render() {
		const commenter = this.props.commenter;
		return (
			<div
				className="commenter-reference-works"
			>
				<div className="commenter-reference-works-title">
					<h2>
						Reference Works
					</h2>
				</div>
				<ReferenceWorksList
					commenterId={commenter._id}
				/>
			</div>
		);
	},

});
