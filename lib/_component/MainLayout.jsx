MainLayout = React.createClass({
	propTypes: {
		content: React.PropTypes.object.isRequired,
	},

	render() {
		return (
			<main>
				{this.props.content}
			</main>
		);
	},
});
