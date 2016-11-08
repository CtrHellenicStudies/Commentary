import { Avatars } from '/imports/avatar/avatar_collections.js';

CommentersList = React.createClass({


	propTypes: {
		limit: React.PropTypes.number,
		featureOnHomepage: React.PropTypes.bool,
		defaultAvatarUrl: React.PropTypes.string,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('avatars.commenter.all');

		const query = {};
		let limit = 100;

		if (this.props.limit) {
			limit = this.props.limit;
		}

		if (this.props.featureOnHomepage) {
			query.featureOnHomepage = this.props.featureOnHomepage;
		}

		const commenters = Commenters.find(query, { sort: { name: 1 }, limit }).fetch();
		for (let i = 0; i < commenters.length; ++i) {
			if (commenters[i].avatar == null) {
				commenters[i].avatarUrl = this.props.defaultAvatarUrl;
			} else {
				const avatar = Avatars.findOne({ _id: commenters[i].avatar });
				if (avatar) {
					commenters[i].avatarUrl = avatar.url;
				} else {
					commenters[i].avatarUrl = this.props.defaultAvatarUrl;
				}
			}
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
