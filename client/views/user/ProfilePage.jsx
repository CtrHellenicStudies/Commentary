
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import AvatarEditor from '/imports/avatar/client/ui/AvatarEditor.jsx';
import Toggle from 'material-ui/Toggle';

ProfilePage = React.createClass({


	propTypes: {
		user: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			annotationCheckList: [],
			skip: 0,
			limit: 100,
			name: '',
			biography: '',
			academiaEdu: '',
			twitter: '',
			facebook: '',
			google: '',

			usernameError: '',
			emailError: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		const user = this.props.user;
		let profile = {};
		if ('profile' in user) {
			profile = user.profile;
		}

		this.setState({
			name: profile.name || '',
			biography: profile.biography || '',
			academiaEdu: profile.academiaEdu || '',
			twitter: profile.twitter || '',
			facebook: profile.facebook || '',
			google: profile.google || '',
		});
	},

	getMeteorData() {
		let discussionComments = [];

		const handle = Meteor.subscribe('user.discussionComments',
			{},
			this.state.skip,
			this.state.limit
		);

		if (handle.ready()) {
			discussionComments = DiscussionComments.find({
				'user._id': Meteor.userId(),
			}).fetch();

			discussionComments.forEach(function (discussionComment) {
				const commentHandle = Meteor.subscribe('comments', { _id: discussionComment.commentId }, 0, 1);
				if (commentHandle.ready()) {
					const comments = Comments.find().fetch();
					if (comments.length) {
						discussionComment.comment = comments[0];
					} else {
						discussionComment.comment = { work: '', subwork: '', discussionComments: [] };
					}
				} else {
					discussionComment.comment = { work: '', subwork: '', discussionComments: [] };
				}

				discussionComment.otherCommentsCount = DiscussionComments.find({ commentId: discussionComment.commentId }).count();
			});
		}

		return {
			discussionComments,
		};
	},

	loadMore() {
		this.setState({
			skip: this.state.skip + 10,
		});
	},

	handleChangeText(key) {
		const user = this.props.user;
		const self = this;

        let value = null;
        if (key === 'biography') {
        	value = this.refs[key].input.refs.input.value;
            
        } else if (key === 'publicEmailAdress') {
        	// do nothing
        } else {
            value = this.refs[key].input.value;
        } 
        this.setState({
            [key]: value,
        });

        let accountData = {
			username: self.refs.username.input.value || user.username,
			name: self.refs.name.input.value || user.profile.name,
			biography: self.refs.biography.input.refs.input.value || user.profile.biography,
			academiaEdu: self.refs.academiaEdu.input.value || user.profile.academiaEdu,
			twitter: self.refs.twitter.input.value || user.profile.twitter,
			facebook: self.refs.facebook.input.value || user.profile.facebook,
			google: self.refs.google.input.value || user.profile.google,
		};

		if (user.emails && user.emails.length > 0) {
			accountData.emails = [{
				address: self.refs.email.input.value || user.emails[0].address,
				verified:  user.emails[0].verified,
			}];
			const setPublic = this.refs.publicEmailAdress.state.switched;
			if (key === 'publicEmailAdress' && !setPublic) {
				accountData.publicEmailAdress = self.refs.email.input.value || user.emails[0].address;
			} else {
				accountData.publicEmailAdress = "";
			}
		}

		Meteor.call('updateAccount', accountData, function (err, res) {
			if (err) {
				console.error(err);
			}
		});
	},

	handleUsernameChange () {
		let key = 'username';
		const re = /^[a-z0-9A-Z_]{3,15}$/;
		if (re.test(value = this.refs[key].input.value)) {
			this.setState({
				usernameError: '',
			});
			this.handleChangeText(key);
		} else {
			this.setState({
				usernameError: 'Username has following the requirements: only letters and numbers are aloud, no whitespaces, min. length: 3, max. length: 15',
			});
		};	
	},

	handleEmailChange () {
		let key = 'email';
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(value = this.refs[key].input.value)) {
			this.setState({
				emailError: '',
			});
			this.handleChangeText(key);
		} else {
			this.setState({
				emailError: 'Invalid email address',
			});
		};	
	},

	render() {
		let currentUser = this.props.user;
		if (!currentUser) {
			currentUser = { 'profile': {} };
		}
		const toggleStyle = {
			style: {
				margin: "20px 0 0 0",
			},
		};

		return (
			(currentUser ?
				<div className="page page-user-profile">
					<div className="content primary">

						<section className="block header cover parallax">
							<div className="background-image-holder blur-2--no-remove blur-10 remove-blur">
								<img className="background-image" src="/images/capitals.jpg" role="presentation" />
							</div>
							<div className="block-screen brown" />

							<div className="container v-align-transform">

								<div className="grid inner">
									<div className="center-content">

										<div className="page-title-wrap">
											{
												/*
												<h2 className="page-title ">{currentUser.nicename}</h2>
												<h3 className="page-subtitle"></h3>
												*/
											}
										</div>

									</div>
								</div>
							</div>
						</section>

						<section className="page-content">
							<div>
								<div className="user-profile-section">
									<AvatarEditor
										defaultAvatarUrl="/images/default_user.jpg"
									/>
								</div>
								<br />

								<div className="user-profile-textfields">

									<TextField
										ref="username"
										fullWidth
										floatingLabelText="Username"
										defaultValue={currentUser.username}
										onChange={debounce(1500, this.handleUsernameChange)}
										errorText={this.state.usernameError}
									/>
									<br />

									{currentUser.emails ?
									<div>
										<TextField
											ref="email"
											fullWidth
											floatingLabelText="Email"
											defaultValue={currentUser.emails[0].address}
											onChange={debounce(1500, this.handleEmailChange)}
											errorText={this.state.emailError}
										/>
										<Toggle
											ref="publicEmailAdress"
									        label={currentUser.profile.publicEmailAdress ? "Email public" : "Email private"}
									        labelPosition="right"
									        style={toggleStyle.style}
									        toggled={currentUser.profile.publicEmailAdress ? true : false}
									        onToggle={debounce(500, this.handleChangeText.bind(null, 'publicEmailAdress'))}
									    />
									</div>
									:
									""}

									<TextField
										ref="name"
										fullWidth
										floatingLabelText="Name"
										defaultValue={currentUser.profile.name}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'name'))}
									/>
									<br />

									<TextField
										ref="biography"
										multiLine
										rows={2}
										rowsMax={10}
										fullWidth
										floatingLabelText="Biography"
										defaultValue={currentUser.profile.biography}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'biography'))}
									/>
									<br />

									<TextField
										ref="academiaEdu"
										fullWidth
										hintText="http://university.academia.edu/YourName"
										floatingLabelText="Academia.edu"
										defaultValue={currentUser.profile.academiaEdu}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'academiaEdu'))}
									/>
									<br />

									<TextField
										ref="twitter"
										fullWidth
										hintText="https://twitter.com/@your_name"
										floatingLabelText="Twitter"
										defaultValue={currentUser.profile.twitter}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'twitter'))}
									/>
									<br />

									<TextField
										ref="facebook"
										fullWidth
										hintText="https://facebook.com/your.name"
										floatingLabelText="Facebook"
										defaultValue={currentUser.profile.facebook}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'facebook'))}
									/>
									<br />

									<TextField
										ref="google"
										fullWidth
										hintText="https://plus.google.com/+YourName"
										floatingLabelText="Google Plus"
										defaultValue={currentUser.profile.google}
										onChange={debounce(3000, this.handleChangeText.bind(null, 'google'))}
									/>

									<br />
									<br />
									<br />
									<span className="form-save-help">
													(These values are saved automatically.)
									</span>

								</div>

							</div>

							<div className="article-content">
								<div id="container1" className="data-visualization" />
								<div id="container2" className="data-visualization" />
							</div>

							<hr className="user-divider" />

							<div className="user-discussion-comments">

								<h2>Your Comments</h2>
								{/*
									Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter']) ?
									<div>
										<FlatButton
											label="Add new comment"
											href="/add-comment"
											icon={<FontIcon className="mdi mdi-plus" />}
											style={{ height: '100%', lineHeight: '100%' }}
										/>
									</div>
											:
											''
										*/}
								{
									/*
									<InfiniteScroll
										endPadding={120}
										loadMore={this.loadMore} >
									{
									*/
								}

								<DiscussionCommentsList
									discussionComments={this.data.discussionComments}
								/>

								{/*
											<div className="ahcip-spinner commentary-loading" >
													<div className="double-bounce1"></div>
													<div className="double-bounce2"></div>

											</div>
											*/}

								{/* }</InfiniteScroll>*/}

							</div>

						</section>

					</div>

				</div>
			: <div />
			)

		);
	},

});
