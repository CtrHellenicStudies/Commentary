import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import DiscussionComments from '/imports/api/collections/discussionComments';

// components
import DiscussionCommentsList from '/imports/ui/components/discussionComments/DiscussionCommentsList';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';

// lib
import muiTheme from '/imports/lib/muiTheme';

const checkUsername = (user) => {
	if (user.username !== FlowRouter.getParam('username')) {
		const route = `/users/${FlowRouter.getParam('userId')}`;
		FlowRouter.go(route);
	}
};

const PublicProfilePage = React.createClass({
	propTypes: {
		userId: React.PropTypes.string,
		user: React.PropTypes.object,
		discussionComments: React.PropTypes.array,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			skip: 0,
			limit: 100,
			userEmail: null,
		};
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(muiTheme),
		};
	},

	render() {
		const { user, discussionComments } = this.props;
		let avatarUrl = '/images/default_user.jpg';

		if (!user) {
			return <LoadingPage />;
		}

		if (!user.profile) {
			user.profile = {};
		}
		if ('avatarUrl' in user.profile) {
			avatarUrl = user.profile.avatarUrl;
		}

		return (
			<div className="page page-user-profile page-user-profile--public">
				<div className="content primary">
					<section className="block header cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/capitals.jpg"
						/>
					</section>
					<section className="page-content">
						<div>
							<div className="user-profile-section">
								<div className="user-profile-picture-container">
									<div className="user-profile-picture">
										<img alt="avatar" src={avatarUrl} />
									</div>
								</div>
							</div>
							<br />
							<div className="user-profile-textfields">
								{ user.profile.name ?
									<div>
										{ user.username ?
											<div className="public-profile-name">
												<h2>{ user.profile.name } ({ user.username })</h2>
												<br />
											</div>
											:
											<div className="public-profile-name">
												<h2>{ user.profile.name }</h2>
												<br />
											</div>}
									</div>
									:
									<div>
										{ user.username ?
											<div className="public-profile-name">
												<h2>{ user.username }</h2>
												<br />
											</div>
											:
											<div className="public-profile-name">
												<h2>There is no public profile name available for this user.</h2>
												<br />
											</div> }
									</div>}
								{ user.profile.biography ?
									<div className="public-profile-biography">
										<p>
											{ user.profile.biography }
										</p>
										<br />
									</div>
									:
									<div className="public-profile-biography">
										<p>
											There is no public biography available for this user.
										</p>
										<br />
									</div> }
								{ user.profile.publicEmailAdress ?
									<div className="public-profile-link">
										<h3>Email: </h3>
										<span>
											{ user.profile.publicEmailAdress }
										</span>
										<br />
									</div>
									:
									'' }
								{ user.profile.academiaEdu ?
									<div className="public-profile-link">
										<h3>Academia:</h3>
										<a
											href={user.profile.academiaEdu}
											target="_blank"
											rel="noopener noreferrer"
										>
											{ user.profile.academiaEdu }
										</a>
										<br />
									</div>
									:
									'' }
								{ user.profile.twitter ?
									<div className="public-profile-link">
										<h3>Twitter:</h3>
										<a
											href={user.profile.twitter}
											target="_blank"
											rel="noopener noreferrer"
										>
											{ user.profile.twitter }
										</a>
										<br />
									</div>
									:
									'' }
								{ user.profile.facebook ?
									<div className="public-profile-link">
										<h3>Facebook:</h3>
										<a
											href={user.profile.facebook}
											target="_blank"
											rel="noopener noreferrer"
										>
											{ user.profile.facebook }
										</a>
										<br />
									</div>
									:
									'' }
								{ user.profile.google ?
									<div className="public-profile-link">
										<h3>Google:</h3>
										<a
											href={user.profile.google}
											target="_blank"
											rel="noopener noreferrer"
										>
											{ user.profile.google }
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
							<DiscussionCommentsList
								discussionComments={discussionComments}
							/>
						</div>
					</section>
				</div>
			</div>
		);
	},
});

const PublicProfilePageContainer = createContainer(({ userId }) => {
	let user = {};
	let discussionComments = [];

	Meteor.subscribe('users.id', userId);
	Meteor.subscribe('user.discussionComments', userId, Session.get('tenantId'));

	user = Meteor.users.findOne({
		_id: userId,
	});

	discussionComments = DiscussionComments.find({
		userId,
		status: 'publish',
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
		checkUsername(user);
	}

	return {
		user,
		discussionComments,
	};
}, PublicProfilePage);

export default PublicProfilePageContainer;
