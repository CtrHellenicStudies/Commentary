import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// commenter Teaser
CommenterTeaser = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	render() {
		const commenter = this.props.commenter;
		const commenterUrl = `/commenters/${commenter.slug}`;
		const commenterExcerpt = commenter.tagline ? Utils.trunc(commenter.tagline, 120) : '';


		return (
			<div className="commenter-teaser hvr-grow wow fadeIn">
				<a href={commenterUrl}>
					<div className="commenter-image paper-shadow">
						<img
							src={commenter.avatarUrl ? commenter.avatarUrl : '/images/default_user.jpg'}
							alt={commenter.name}
						/>
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
