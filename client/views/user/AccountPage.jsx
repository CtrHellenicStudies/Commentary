
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';


AccountPage = React.createClass({

	propTypes: {
	},

	getInitialState() {
		return {
		}
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],
	getMeteorData(){
		var discussionComments = [];
		var user = Meteor.user();

		var handle = Meteor.subscribe("user.discussionComments", Meteor.user());
		if(handle.ready()){
			discussionComments = DiscussionComments.find().fetch();

		}

		return {
			discussionComments: discussionComments,
			user: user
		};
	},

	render() {
		let userIsLoggedIn = false;
		let currentUser = this.data.user;

		return (
			(currentUser ?
				<div className="page page-user-profile">
					<div className="content primary">

							<section className="block header cover parallax">
									<div className="background-image-holder blur-2--no-remove blur-10 remove-blur">
											<img alt="image" className="background-image" src="/images/capitals.jpg"/>
									</div>
									<div className="block-screen brown"></div>

									<div className="container v-align-transform">

											<div className="grid inner">
													<div className="center-content">

															<div className="page-title-wrap">
																	<h2 className="page-title ">{user.nicename}</h2>
																	<h3 className="page-subtitle"></h3>
															</div>


													</div>
											</div>
									</div>
							</section>

							<section className="page-content">
									<p>
										{user.bio}
									</p>
									<div>
										<div className="user-profile-section">
												<div className="user-profile-picture">
													<img src="/images/entity_cato-small.jpg" />
												</div>

												<div className="upload-profile-picture">
													<FlatButton
														label="Change Profile Picture"
														className="user-profile-button save-button"
														onClick={this._openFileDialog}/>
													<input
														ref="fileUpload"
														type="file"
														style={{"display" : "none"}}
														onChange={this._handleChange}/>

												</div>
											</div>
											<br/>

											<div className="user-profile-textfields">
												<TextField
														fullWidth={true}
														defaultValue="Archimedes"
														floatingLabelText="First Name"
													/>
												<br/>

												<TextField
														fullWidth={true}
														defaultValue="of Syracuse"
														floatingLabelText="Last Name"
													/>
												<br/>

												<TextField
														multiLine={true}
														rows={2}
														rowsMax={10}
														fullWidth={true}
														defaultValue="Inventor of the Claw and the Death Ray. Helped build the walls of Syracuse. All around badass."
														floatingLabelText="Biography"
													/>
												<br />

												<TextField
														fullWidth={true}
														hintText="http://university.academia.edu/YourName"
														floatingLabelText="Academia.edu"
													/>
												<br/>

												<TextField
														fullWidth={true}
														hintText="https://plus.google.com/+YourName"
														floatingLabelText="Google Plus"
													/>
												<br/>

												<TextField
														fullWidth={true}
														hintText="https://twitter.com/@your_name"
														floatingLabelText="Twitter"
													/>
												<br/>

												<TextField
														fullWidth={true}
														hintText="https://facebook.com/your.name"
														floatingLabelText="Facebook"
													/>
												<br/>
												<br/>
												<br/>

											</div>

											<FlatButton
												label="Save"
												className="user-profile-button save-button"
												/>

										</div>

							</section>


					</div>

				</div>
			: <div>
				</div>
			)

		);

	}

});
