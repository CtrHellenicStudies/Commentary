import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// commenter Teaser
CommenterTeaser = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},


	render() {
		let commenter = this.props.commenter;
		let commenter_url = "/commenters/" + commenter.slug ;
		let commenterExcerpt = commenter.tagline ? Utils.trunc(commenter.tagline, 120) : "";


		 return (
			 <div className="author-teaser hvr-grow wow fadeIn" >
							<a href={commenter_url} >
									<div className="author-image paper-shadow">
										<img src={commenter.avatarUrl} alt={commenter.name}/>
									</div>
							</a>
							<div className="author-teaser-text">
								<a href={commenter_url} >
											<h3>{commenter.name}</h3>
									</a>
									<hr/>
									<p className="author-description">
											{commenterExcerpt}
									</p>

							</div>
					</div>


			);
		}

});
