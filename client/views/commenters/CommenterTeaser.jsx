import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Avatars } from '/imports/avatar/avatar_collections.js';
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';

// commenter Teaser
CommenterTeaser = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
		commenterAvatarUrl: React.PropTypes.string,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	mixins: [ReactMeteorData],

	getMeteorData() {

		const commenter = this.props.commenter;
		let avatarData = null;
		const avatarSubscription = Meteor.subscribe('avatars.commenter.all');
		if (commenter.avatar) {
			avatarData = Avatars.findOne(commenter.avatar);
		}

		return {
			avatarData,
		}
	},

	render() {
		const commenter = this.props.commenter;
		const commenterAvatarUrl = this.props.commenterAvatarUrl;
		const commenterUrl = `/commenters/${commenter.slug}`;
		const commenterExcerpt = commenter.tagline ? Utils.trunc(commenter.tagline, 120) : '';
		const avatarData = this.data.avatarData;


		return (
			<div className="commenter-teaser hvr-grow wow fadeIn">
				<a href={commenterUrl}>
					<div className="commenter-image paper-shadow">
						{avatarData ?
							<AvatarIcon avatar={avatarData} />
						:
							<img
								src={commenterAvatarUrl ? commenterAvatarUrl : '/images/default_user.jpg'}
								alt={commenter.name}
							/>
						}
					</div>
				</a>
				<div className="commenter-teaser-text">
					<a href={commenterUrl}>
						<h3>{commenter.name}</h3>
					</a>
					<hr />
					<p className="commenter-description">
						{commenterExcerpt}
					</p>

				</div>
			</div>


		);
	},

});
