import Masonry from 'react-masonry-component/lib';


ReferenceWorksList = React.createClass({

	propTypes: {
		commenterId: React.PropTypes.string,
	},

	// This mixin makes the getMeteorData method referenceWork
	mixins: [ReactMeteorData],

	// Loads items from the referenceWorks collection and puts them on this.data.referenceWorks
	getMeteorData() {
		const query = {
		};

		if (this.props.commenterId) {
			query.authors = this.props.commenterId;
		}

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
			<Masonry
				options={masonryOptions}
				className="reference-works-list"
			>
				{this.renderReferenceWorks()}
			</Masonry>
		);
	},

});
