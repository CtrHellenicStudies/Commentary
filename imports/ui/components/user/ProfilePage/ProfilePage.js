import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import Toggle from 'material-ui/Toggle';

// api
import Comments from '/imports/api/collections/comments';
import DiscussionComments from '/imports/api/collections/discussionComments';
import Settings from '/imports/api/collections/settings';

// components
import AvatarEditor from '/imports/ui/components/avatar/AvatarEditor';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import DiscussionCommentsList from '/imports/ui/components/discussionComments/DiscussionCommentsList';
import ModalChangePwd from '/imports/ui/layouts/auth/ModalChangePwd';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


const ProfilePage = React.createClass({
	propTypes: {
		user: React.PropTypes.object,
		settings: React.PropTypes.object,
		discussionComments: React.PropTypes.array,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		let isPublicEmail = false;
		const { user } = this.props;

		if (user && user.profile.publicEmailAdress !== undefined) {
			isPublicEmail = true;
		}

		return {
			annotationCheckList: [],
			skip: 0,
			limit: 100,
			usernameError: '',
			emailError: '',
			modalChangePwdLowered: false,
			isPublicEmail,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	componentWillMount() {
		this.handleChangeTextDebounced = debounce(1000, this.handleChangeTextDebounced);
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
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
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
		const { user, settings, discussionComments } = this.props;

		const toggleStyle = {
			style: {
				margin: '20px 0 0 0',
			},
		};

		const changePwdStyle = {
			margin: '11px 0 0 0',
		};

		if (settings) {
			Utils.setTitle(`Profile Page | ${settings.title}`);
			Utils.setDescription('');
			Utils.setMetaImage('');
		}

		if (!user) {
			return <LoadingPage />;
		}

		return (
			<div className="page page-user-profile">
				<div className="content primary">

					<section className="block header cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/capitals.jpg"
						/>

						<div className="container v-align-transform">

							<div className="grid inner">
								<div className="center-content">

									<div className="page-title-wrap">
										{
											/*
											 <h2 className="page-title ">{user.nicename}</h2>
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
									defaultValue={user.username}
									onChange={this.handleChangeText.bind(null, 'username')}
									errorText={this.state.usernameError}
								/>
								<br />

								<RaisedButton
									label="Change password"
									style={changePwdStyle}
									onClick={this.showChangePwdModal}
								/>

								{user.emails ?
									<div>
										<TextField
											fullWidth
											floatingLabelText="Email"
											defaultValue={user.emails[0].address}
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
									defaultValue={user.profile.name}
									onChange={this.handleChangeText.bind(null, 'name')}
								/>
								<br />

								<TextField
									multiLine
									rows={2}
									rowsMax={10}
									fullWidth
									floatingLabelText="Biography"
									defaultValue={user.profile.biography}
									onChange={this.handleChangeText.bind(null, 'biography')}
								/>
								<br />

								<TextField
									fullWidth
									hintText="http://university.academia.edu/YourName"
									floatingLabelText="Academia.edu"
									defaultValue={user.profile.academiaEdu}
									onChange={this.handleChangeText.bind(null, 'academiaEdu')}
								/>
								<br />

								<TextField
									fullWidth
									hintText="https://twitter.com/@your_name"
									floatingLabelText="Twitter"
									defaultValue={user.profile.twitter}
									onChange={this.handleChangeText.bind(null, 'twitter')}
								/>
								<br />

								<TextField
									fullWidth
									hintText="https://facebook.com/your.name"
									floatingLabelText="Facebook"
									defaultValue={user.profile.facebook}
									onChange={this.handleChangeText.bind(null, 'facebook')}
								/>
								<br />

								<TextField
									fullWidth
									hintText="https://plus.google.com/+YourName"
									floatingLabelText="Google Plus"
									defaultValue={user.profile.google}
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
								discussionComments={discussionComments}
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
		);
	},
});

const ProfilePageContainer = createContainer(() => {
	let discussionComments = [];
	Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	Meteor.subscribe('user.discussionComments', Meteor.userId(), Session.get('tenantId'));

	discussionComments = DiscussionComments.find({
		userId: Meteor.userId(),
	}).fetch();

	discussionComments.forEach((discussionComment, discussionCommentIndex) => {
		const commentHandle = Meteor.subscribe('comments', {
			_id: discussionComment.commentId,
			tenantId: Session.get('tenantId')
		}, 0, 1);

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

	return {
		discussionComments,
		settings: Settings.findOne(),
	};
}, ProfilePage);

export default ProfilePageContainer;
