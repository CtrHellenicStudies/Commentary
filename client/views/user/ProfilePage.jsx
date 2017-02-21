import { Session } from 'meteor/session';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import AvatarEditor from '/imports/avatar/client/ui/AvatarEditor.jsx';
import Toggle from 'material-ui/Toggle';
import DiscussionComments from '/imports/collections/discussionComments';

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
			usernameError: '',
			emailError: '',
			modalChangePwdLowered: false,
			isPublicEmail: this.props.user.profile.publicEmailAdress !== undefined,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentWillMount() {
		this.handleChangeTextDebounced = debounce(1000, this.handleChangeTextDebounced);
	},

	getMeteorData() {
		let discussionComments = [];

		const handle = Meteor.subscribe('user.discussionComments',
			{tenantId: Session.get("tenantId")},
			this.state.skip,
			this.state.limit
		);

		if (handle.ready()) {
			discussionComments = DiscussionComments.find({
				'user._id': Meteor.userId(),
			}).fetch();

			discussionComments.forEach((discussionComment, discussionCommentIndex) => {
				const commentHandle =
					Meteor.subscribe('comments', { _id: discussionComment.commentId, tenantId: Session.get("tenantId") }, 0, 1);
				if (commentHandle.ready()) {
					const comments = Comments.find().fetch();
					if (comments.length) {
						discussionComments[discussionCommentIndex].comment = comments[0];
					} else {
						discussionComments[discussionCommentIndex].comment = {
							work: '',
							subwork: '',
							discussionComments: [],
						};
					}
				} else {
					discussionComments[discussionCommentIndex].comment = {
						work: '',
						subwork: '',
						discussionComments: [],
					};
				}

				discussionComments[discussionCommentIndex].otherCommentsCount =
					DiscussionComments.find({ commentId: discussionComment.commentId }).count();
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

	handleChangeText(field, event) {
		const value = event.target.value;
		this.handleChangeTextDebounced(field, value);
	},

	handleChangeTextDebounced(field, value) {
		const user = this.props.user;
		let emailValue = [];
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		switch (field) {
		case 'username':
			if (/^[a-z0-9A-Z_]{3,15}$/.test(value)) {
				Meteor.call('updateAccount', field, value, (err) => {
					if (err) {
						console.error(err);
					}
				});
			} else {
				this.setState({
					usernameError: 'Username has following the requirements: only letters and ' +
					'numbers are aloud, no whitespaces, min. length: 3, max. length: 15',
				});
			}
			break;
		case 'email':
			if (re.test(value)) {
				this.setState({
					emailError: '',
				});
				if (user.emails && user.emails.length > 0) {
					emailValue = [{
						address: value || user.emails[0].address,
						verified: user.emails[0].verified,
					}];
				}
				Meteor.call('updateAccount', field, emailValue, (err) => {
					if (err) {
						console.error(err);
					}
				});
			} else {
				this.setState({
					emailError: 'Invalid email address',
				});
			}
			break;

		default:
			Meteor.call('updateAccount', `profile.${field}`, value, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
	},

	handlePublicEmailToggle() {
		const user = this.props.user;
		const setPublic = !this.state.isPublicEmail;
		this.setState({
			isPublicEmail: setPublic,
		});
		let publicEmailAdress = '';
		if (setPublic) {
			publicEmailAdress = user.emails[0].address;
		}
		Meteor.call('updateAccount', 'profile.publicEmailAdress', publicEmailAdress, (err) => {
			if (err) {
				console.error(err);
			}
		});
	},

	showChangePwdModal() {
		this.setState({
			modalChangePwdLowered: true,
		});
	},

	closeChangePwdModal() {
		this.setState({
			modalChangePwdLowered: false,
		});
	},

	render() {
		let currentUser = this.props.user;
		if (!currentUser) {
			currentUser = { profile: {} };
		}
		const toggleStyle = {
			style: {
				margin: '20px 0 0 0',
			},
		};

		const changePwdStyle = {
			margin: '11px 0 0 0',
		};

		return (
			(currentUser ?
				<div className="page page-user-profile">
					<div className="content primary">

						<section className="block header cover parallax">
							<div className="background-image-holder blur-2--no-remove blur-10 remove-blur">
								<img
									className="background-image"
									src="/images/capitals.jpg"
									role="presentation"
								/>
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
										fullWidth
										floatingLabelText="Username"
										defaultValue={currentUser.username}
										onChange={this.handleChangeText.bind(null, 'username')}
										errorText={this.state.usernameError}
									/>
									<br />

									<RaisedButton
										label="Change password"
										style={changePwdStyle}
										onClick={this.showChangePwdModal}
									/>

									{currentUser.emails ?
										<div>
											<TextField
												fullWidth
												floatingLabelText="Email"
												defaultValue={currentUser.emails[0].address}
												onChange={this.handleChangeText.bind(null, 'emails')}
												errorText={this.state.emailError}
											/>
											<Toggle
												label={this.state.isPublicEmail ? 'Email public' : 'Email private'}
												labelPosition="right"
												style={toggleStyle.style}
												toggled={this.state.isPublicEmail}
												onToggle={this.handlePublicEmailToggle}
											/>
										</div>
										: ''
									}

									<TextField
										fullWidth
										floatingLabelText="Name"
										defaultValue={currentUser.profile.name}
										onChange={this.handleChangeText.bind(null, 'name')}
									/>
									<br />

									<TextField
										multiLine
										rows={2}
										rowsMax={10}
										fullWidth
										floatingLabelText="Biography"
										defaultValue={currentUser.profile.biography}
										onChange={this.handleChangeText.bind(null, 'biography')}
									/>
									<br />

									<TextField
										fullWidth
										hintText="http://university.academia.edu/YourName"
										floatingLabelText="Academia.edu"
										defaultValue={currentUser.profile.academiaEdu}
										onChange={this.handleChangeText.bind(null, 'academiaEdu')}
									/>
									<br />

									<TextField
										fullWidth
										hintText="https://twitter.com/@your_name"
										floatingLabelText="Twitter"
										defaultValue={currentUser.profile.twitter}
										onChange={this.handleChangeText.bind(null, 'twitter')}
									/>
									<br />

									<TextField
										fullWidth
										hintText="https://facebook.com/your.name"
										floatingLabelText="Facebook"
										defaultValue={currentUser.profile.facebook}
										onChange={this.handleChangeText.bind(null, 'facebook')}
									/>
									<br />

									<TextField
										fullWidth
										hintText="https://plus.google.com/+YourName"
										floatingLabelText="Google Plus"
										defaultValue={currentUser.profile.google}
										onChange={this.handleChangeText.bind(null, 'google')}
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

								<DiscussionCommentsList
									discussionComments={this.data.discussionComments}
								/>

							</div>

						</section>

					</div>

					{this.state.modalChangePwdLowered ?
						<ModalChangePwd
							lowered={this.state.modalChangePwdLowered}
							closeModal={this.closeChangePwdModal}
						/>
						: ''
					}

				</div>
				: <div />
			)

		);
	},

});
