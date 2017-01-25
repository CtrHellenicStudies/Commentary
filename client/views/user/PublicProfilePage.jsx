import { Session } from 'meteor/session';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AvatarEditor from '/imports/avatar/client/ui/AvatarEditor.jsx';

PublicProfilePage = React.createClass({


	propTypes: {
		userId: React.PropTypes.string.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			skip: 0,
			limit: 100,
			userEmail: null,
		};
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(baseTheme),
		};
	},

	getMeteorData() {
		let user = {};
		let discussionComments = [];
		const userId = this.props.userId;
		const usersHandle = Meteor.subscribe('allUsers', userId);
		const discussionCommentsHandle = Meteor.subscribe('userDiscussionComments', userId, Session.get("tenantId"));
		if (usersHandle.ready()) {
			user = Meteor.users.findOne({
				_id: userId,
			});
			if (discussionCommentsHandle.ready()) {
				discussionComments = DiscussionComments.find({
					'user._id': userId,
				}).fetch();

				discussionComments.forEach((discussionComment, discussionCommentIndex) => {
					const commentHandle = Meteor.subscribe('comments', {
						_id: discussionComment.commentId,
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

					discussionComments[discussionCommentIndex].otherCommentsCount = DiscussionComments.find({
						commentId: discussionComment.commentId,
					}).count();
				});

				if (user) {
					this.checkUsername(user);
				}
			}
		}

		return {
			user,
			discussionComments,
		};
	},

	checkUsername(user) {
		if (user.username !== FlowRouter.getParam('username')) {
			const route = `/users/${FlowRouter.getParam('userId')}`;
			FlowRouter.go(route);
		}
	},

	render() {
		const currentUser = this.data.user;
		if (!currentUser.profile) {
			currentUser.profile = {};
		}

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
						</section>
						<section className="page-content">
							<div>
								<div className="user-profile-section">
									<AvatarEditor
										defaultAvatarUrl="/images/default_user.jpg"
										user={currentUser}
									/>
								</div>
								<br />
								<div className="user-profile-textfields">
									{ currentUser.profile.name ?
										<div>
											{ currentUser.username ?
												<div className="public-profile-name">
													<h2>{ currentUser.profile.name } ({ currentUser.username })</h2>
													<br />
												</div>
												:
												<div className="public-profile-name">
													<h2>{ currentUser.profile.name }</h2>
													<br />
												</div>}
										</div>
										:
										<div>
											{ currentUser.username ?
												<div className="public-profile-name">
													<h2>{ currentUser.username }</h2>
													<br />
												</div>
												:
												<div className="public-profile-name">
													<h2>No name</h2>
													<br />
												</div> }
										</div>}
									{ currentUser.profile.biography ?
										<div className="public-profile-biography">
											<p>
												{ currentUser.profile.biography }
											</p>
											<br />
										</div>
										:
										<div className="public-profile-biography">
											<p>
												No biography.
											</p>
											<br />
										</div> }
									{ currentUser.profile.publicEmailAdress ?
										<div className="public-profile-link">
											<h3>Email: </h3>
											<span>
												{ currentUser.profile.publicEmailAdress }
											</span>
											<br />
										</div>
										:
										'' }
									{ currentUser.profile.academiaEdu ?
										<div className="public-profile-link">
											<h3>Academia:</h3>
											<a
												href={currentUser.profile.academiaEdu}
												target="_blank"
												rel="noopener noreferrer"
											>
												{ currentUser.profile.academiaEdu }
											</a>
											<br />
										</div>
										:
										'' }
									{ currentUser.profile.twitter ?
										<div className="public-profile-link">
											<h3>Twitter:</h3>
											<a
												href={currentUser.profile.twitter}
												target="_blank"
												rel="noopener noreferrer"
											>
												{ currentUser.profile.twitter }
											</a>
											<br />
										</div>
										:
										'' }
									{ currentUser.profile.facebook ?
										<div className="public-profile-link">
											<h3>Facebook:</h3>
											<a
												href={currentUser.profile.facebook}
												target="_blank"
												rel="noopener noreferrer"
											>
												{ currentUser.profile.facebook }
											</a>
											<br />
										</div>
										:
										'' }
									{ currentUser.profile.google ?
										<div className="public-profile-link">
											<h3>Google:</h3>
											<a
												href={currentUser.profile.google}
												target="_blank"
												rel="noopener noreferrer"
											>
												{ currentUser.profile.google }
											</a>
											<br />
										</div>
										:
										'' }
								</div>
							</div>
							<div className="article-content">
								<div
									id="container1"
									className="data-visualization"
								/>
								<div
									id="container2"
									className="data-visualization"
								/>
							</div>
							<hr className="user-divider" />
							<div className="user-discussion-comments">
								<h2>Comments</h2>
								<DiscussionCommentsList discussionComments={this.data.discussionComments} />
							</div>
						</section>
					</div>
				</div>
				: <Loading />
			)

		);
	},

});
