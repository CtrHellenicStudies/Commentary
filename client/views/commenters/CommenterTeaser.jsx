import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// commenter Teaser
CommenterTeaser = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData(){

		let attachment = {};

		if(this.props.commenter.picture){
			const imageSubscription = Meteor.subscribe('profilePictures');

			if (imageSubscription.ready()){
				attachment = ProfilePictures.findOne(this.props.commenter.picture);

			}
		}

		return {
			attachment
		}

	},

	render() {
		let commenter = this.props.commenter;
		let commenter_url = "/commenters/" + commenter.slug ;
		let commenterExcerpt = commenter.tagline ? Utils.trunc(commenter.tagline, 120) : "";
		let image = {};
		let imageUrl = "";
		if ("_id" in this.data.attachment) {
			image = this.data.attachment;
			imageUrl = image.url();
		}


		 return (
			 <div className="author-teaser hvr-grow wow fadeIn" >
							<a href={commenter_url} >
									<div className="author-image paper-shadow">
										<img src={imageUrl.length ? imageUrl : "/images/default_user.jpg"} alt={commenter.name}/>
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
