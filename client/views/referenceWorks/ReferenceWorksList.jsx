import Masonry from 'react-masonry-component/lib';

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
		const masonryOptions = {
			isFitWidth : true,
			transitionDuration: 300,
		};

		return (
			<div className="reference-works-list">
				<Masonry
					options={masonryOptions}
					className="reference-works-list--container container"
				>
					{this.renderReferenceWorks()}
				</Masonry>
			</div>
		);
	},

});
