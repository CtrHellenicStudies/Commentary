import { Avatars } from '/imports/avatar/avatar_collections.js';

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

		Meteor.subscribe('avatars.commenter.all');
		const avatars = Avatars.find().fetch();

		return {
			commenters,
			avatars,
		};
	},

	getAvatarUrl(commenter) {
		if (commenter.avatar === null) {
			return this.props.defaultAvatarUrl;
		} else {
			const avatar = this.data.avatars.find((avatar) => {
				return avatar._id === commenterId;
			});
			if (avatar) {
				return avatar.url;
			} else {
				return this.props.defaultAvatarUrl;
			}
		}
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
