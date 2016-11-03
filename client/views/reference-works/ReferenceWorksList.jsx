ReferenceWorksList = React.createClass({

	propTypes: {
	},

	// This mixin makes the getMeteorData method referenceWork
	mixins: [ReactMeteorData],

	// Loads items from the referenceWorks collection and puts them on this.data.referenceWorks
	getMeteorData() {
		const query = {
		};

		return {
			referenceWorks: ReferenceWorks.find(query, { sort: { title: 1 } }).fetch(),
		};
	},

	renderReferenceWorks() {
		return this.data.referenceWorks.map((referenceWork, i) => {
			return (
				<ReferenceWorkTeaser
					key={i}
					referenceWork={referenceWork}
				/>
			);
		});
	},

	render() {
		return (
			<div className="reference-works-list">
				{this.renderReferenceWorks()}
			</div>
		);
	},

});
