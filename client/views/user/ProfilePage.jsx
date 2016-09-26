
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import InfiniteScroll from '../../../imports/InfiniteScroll';
import {debounce} from 'throttle-debounce';


ProfilePage = React.createClass({


	propTypes: {
		user: React.PropTypes.object
	},

	getInitialState() {
		return {
			annotationCheckList: [],
			skip: 0,
			limit: 10,
			name: "",
			biography: "",
			academiaEdu: "",
			twitter: "",
			facebook: "",
			google: ""
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

		var handle = Meteor.subscribe("user.discussionComments", Meteor.user(), this.state.skip, this.state.limit);
		if(handle.ready()){
			discussionComments = DiscussionComments.find().fetch();

			discussionComments.forEach(function(discussionComment){
				var commentHandle = Meteor.subscribe('comments', {_id: discussionComment.commentId}, 0, 1);
				if (commentHandle.ready()) {
					var comments = Comments.find().fetch();
					if(comments.length){
						discussionComment.comment = comments[0]

					}else {
						discussionComment.comment = {work: "", subwork: "", discussionComments: []};
					}
				}else {
						discussionComment.comment = {work: "", subwork: "", discussionComments: []};
				}

				discussionComment.otherCommentsCount = DiscussionComments.find({commentId: discussionComment.commentId}).count();

			});

		}

		return {
			discussionComments: discussionComments,
		};
	},

	loadMore(){
			this.setState({
				skip : this.state.skip + 10
			});
	},

	_openFileDialog: function(){
		var fileUploadDom = this.refs.fileUpload;
		fileUploadDom.click();

	},

	componentDidMount(){

		var user = this.props.user;
		var profile = {};
		if("profile" in user){
			profile = user.profile;
		}

		this.setState({
			name: profile.name || "",
			biography: profile.biography || "",
			academiaEdu: profile.academiaEdu || "",
			twitter: profile.twitter || "",
			facebook: profile.facebook || "",
			google: profile.google || ""
		});

	},

	handleChangeText(key){
		var user = this.props.user;
		var self = this;

		this.setState({
			[key]: this.refs[key].input.value
		})

		Meteor.call("updateAccount", {
			name: self.refs.name.input.value || user.profile.name,
			biography: self.refs.biography.input.value || user.profile.biography,
			academiaEdu: self.refs.academiaEdu.input.value || user.profile.academiaEdu,
			twitter: self.refs.twitter.input.value || user.profile.twitter,
			facebook: self.refs.facebook.input.value || user.profile.facebook,
			google: self.refs.google.input.value || user.profile.google,

		}, function(err, res){
			if(err){
				console.error(err);
			}

		})

	},

	render() {
		let currentUser = this.props.user;
		if(!currentUser){
			currentUser = {"profile":{}};
		};
		const userIsLoggedIn = Meteor.user();

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
																	{/*<h2 className="page-title ">{currentUser.nicename}</h2>
																	<h3 className="page-subtitle"></h3>
																	*/}
															</div>


													</div>
											</div>
									</div>
							</section>

							<section className="page-content">
									<div>
										<div className="user-profile-section">
												<div className="user-profile-picture"
													onClick={this._openFileDialog}
													>
													<img src="/images/default_user.jpg" />
													<div className="upload-profile-picture">
														<i className="mdi mdi-image-area"></i>
														<span className="help-text">
															Select to upload or drag and drop.
														</span>

														{/*<Dropzone
															className="dropzone"
															ref="dropzone"
															onDrop={this.onDrop}>
														</Dropzone>*/}
														<input
															ref="fileUpload"
															type="file"
															style={{"display" : "none"}}
															onChange={this._handleChange}/>
													</div>

												</div>

											</div>
											<br/>

											<div className="user-profile-textfields">

												<TextField
														ref="name"
														fullWidth={true}
														floatingLabelText="Name"
														defaultValue={currentUser.profile.name}
														onChange={debounce(3000, this.handleChangeText.bind(null, "name"))}
													/>
												<br/>

												<TextField
														ref="biography"
														multiLine={true}
														rows={2}
														rowsMax={10}
														fullWidth={true}
														floatingLabelText="Biography"
														defaultValue={currentUser.profile.biography}
														onChange={debounce(3000, this.handleChangeText.bind(null, "biography"))}
													/>
												<br />

												<TextField
														ref="academiaEdu"
														fullWidth={true}
														hintText="http://university.academia.edu/YourName"
														floatingLabelText="Academia.edu"
														defaultValue={currentUser.profile.academiaEdu}
														onChange={debounce(3000, this.handleChangeText.bind(null, "academiaEdu"))}
													/>
												<br/>

												<TextField
														ref="twitter"
														fullWidth={true}
														hintText="https://twitter.com/@your_name"
														floatingLabelText="Twitter"
														defaultValue={currentUser.profile.twitter}
														onChange={debounce(3000, this.handleChangeText.bind(null, "twitter"))}
													/>
												<br/>

												<TextField
														ref="facebook"
														fullWidth={true}
														hintText="https://facebook.com/your.name"
														floatingLabelText="Facebook"
														defaultValue={currentUser.profile.facebook}
														onChange={debounce(3000, this.handleChangeText.bind(null, "facebook"))}
													/>
												<br/>

												<TextField
														ref="google"
														fullWidth={true}
														hintText="https://plus.google.com/+YourName"
														floatingLabelText="Google Plus"
														defaultValue={currentUser.profile.google}
														onChange={debounce(3000, this.handleChangeText.bind(null, "google"))}
													/>

												<br/>
												<br/>
												<br/>
												<span className="form-save-help">
													(These values are saved automatically.)
												</span>

											</div>

										</div>

									<div className="article-content">
											<div id="container1" className="data-visualization"></div>
											<div id="container2" className="data-visualization"></div>
									</div>

									<hr className="user-divider"/>

									<div className="user-discussion-comments">

										<h2>Your Comments</h2>
										{userIsLoggedIn.commenterId ?
											<div>
												<FlatButton
													label="Add new comment"
													href="/add-comment"
													icon={<FontIcon className="mdi mdi-plus" />}
													style={{height:'100%', lineHeight: '100%'}}
												/>
											</div>
											:
											""
										}
										{/*}<InfiniteScroll
											endPadding={120}
											loadMore={this.loadMore}
											>*/}

											<DiscussionCommentsList
												discussionComments={this.data.discussionComments}
												/>

											{/*
											<div className="ahcip-spinner commentary-loading" >
													<div className="double-bounce1"></div>
													<div className="double-bounce2"></div>

											</div>
											*/}

									{/*}</InfiniteScroll>*/}

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
