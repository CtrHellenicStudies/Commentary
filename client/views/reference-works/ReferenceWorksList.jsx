import Masonry from 'react-masonry-component/lib';


ReferenceWorksList = React.createClass({

	propTypes: {
		commenterId: React.PropTypes.string,
	},

	// This mixin makes the getMeteorData method referenceWork
	mixins: [ReactMeteorData],

	// Loads items from the referenceWorks collection and puts them on this.data.referenceWorks
	getMeteorData() {
		// SUBSCRIPTIONS:
		const query = {};
		if (this.props.commenterId) {
			query.authors = this.props.commenterId;
			Meteor.subscribe('referenceWorks.commenterId', this.props.commenterId);
		} else {
			Meteor.subscribe('referenceWorks');
		}

		// FETCH DATA:
		const referenceWorks = ReferenceWorks.find(query, { sort: { title: 1 } }).fetch();

		return {
			referenceWorks,
		};
	},

	renderReferenceWorks() {
		return this.data.referenceWorks.map((referenceWork, i) => (
			<ReferenceWorkTeaser
				key={i}
				referenceWork={referenceWork}
			/>
		));
	},

	render() {
		const masonryOptions = {
			isFitWidth: true,
			transitionDuration: 300,
		};
		return (
			<div>
				{this.data.referenceWorks.length ?
					<Masonry
						options={masonryOptions}
						className="reference-works-list"
					>
						{this.renderReferenceWorks()}
					</Masonry>
					:
					<p className="no-results no-results-reference-works">No reference works found.</p>
				}
			</div>
		);
	},

});
