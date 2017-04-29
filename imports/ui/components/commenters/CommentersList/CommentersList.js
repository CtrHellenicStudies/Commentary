import Commenters from '/imports/collections/commenters';

CommentersList = React.createClass({

	propTypes: {
		limit: React.PropTypes.number,
		featureOnHomepage: React.PropTypes.bool,
		defaultAvatarUrl: React.PropTypes.string,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		let commenters = [];
		let limit = 100;
		if (this.props.limit) {
			limit = this.props.limit;
		}

		// SUBSCRIPTIONS:
		if (this.props.featureOnHomepage) {
			Meteor.subscribe('commenters.featureOnHomepage', Session.get("tenantId") ,limit);
			commenters = Commenters.find({
				featureOnHomepage: true,
			}, {
				sort: {
					name: 1,
				},
				limit,
			}).fetch();
		} else {
			Meteor.subscribe('commenters', limit);
			commenters = Commenters.find({}, { sort: { name: 1 }, limit }).fetch();
		}

		return {
			commenters,
		};
	},

	renderCommenters() {
		return this.data.commenters.map((commenter) =>
			<CommenterTeaser
				key={commenter._id}
				commenter={commenter}
			/>
		);
	},

	render() {
		return (
			<div className="commenters-list">
				{this.renderCommenters()}
			</div>
		);
	},
});
