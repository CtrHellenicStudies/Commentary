import "../../node_modules/mdi/css/materialdesignicons.css";


MasterLayout = React.createClass({

	propTypes: {
		content: React.PropTypes.object,
	},

	render() {
		return (
			<div className="chs-layout master-layout">

				<Header />

				<main>
					{this.props.content}
				</main>
				<Footer />

			</div>
		);
	},
});
