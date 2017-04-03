import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

DiscussionComment = React.createClass({

	propTypes: {
		discussionComment: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			editMode: false,
			moreOptionsVisible: false,
			shareOptionsVisible: false,
			readComment: false,
		};
	},

	getMeteorData() {
		const { discussionComment } = this.props;
		const handle = Meteor.subscribe('users.id', discussionComment.userId);
		const user = Meteor.users.findOne({ _id: discussionComment.userId });

		return {
			user,
			ready: handle.ready(),
		};
	},

	showEditMode() {
		this.setState({
			editMode: true,
		});
	},

	closeEditMode() {
		this.setState({
			editMode: false,
		});
	},

	updateDiscussionComment() {
		const content = $(this.updateCommentForm).find('textarea').val();

		Meteor.call('discussionComments.update',
			this.props.discussionComment._id,
			{ content },
		);

		this.setState({
			editMode: false,
		});
	},

	upvoteDiscussionComment() {
		const { currentUser } = this.props;
		if (currentUser) {
			Meteor.call('discussionComments.upvote',
				this.props.discussionComment._id
			);
		}
	},

	reportDiscussionComment() {
		const { currentUser } = this.props;
		if (currentUser) {
			this.setState({
				moreOptionsVisible: false,
			});
			Meteor.call('discussionComments.report',
				this.props.discussionComment._id
			);
		}
	},

	unreportDiscussionComment() {
		const { currentUser } = this.props;
		if (currentUser) {
			this.setState({
				readComment: false,
			});
			Meteor.call('discussionComments.unreport',
				this.props.discussionComment._id
			);
		}
	},

	toggleMoreOptions() {
		this.setState({
			moreOptionsVisible: !this.state.moreOptionsVisible,
			shareOptionsVisible: false,
		});
	},

	toggleShareOptions() {
		this.setState({
			shareOptionsVisible: !this.state.shareOptionsVisible,
			moreOptionsVisible: false,
		});
	},

	readDiscussionComment() {
		this.setState({
			readComment: true,
		});
	},

	render() {
		const self = this;
		const userIsLoggedIn = Meteor.user();
		const { discussionComment } = this.props;
		const { user } = this.data;
		let userLink = '';
		let userUpvoted = false;
		let userReported = false;
		let username = '';
		let offsetLeft = 0;
		let status;


		// Child discussion Comments
		discussionComment.children = [];

		// Make user link and user name
		if (user) {
			if (user.username) {
				username = user.username;
				userLink = `/users/${user._id}/${user.username}`;
			} else if (
				'emails' in user
				&& user.emails.length
			) {
				userLink = `/users/${user._id}`;
				username = user.emails[0].address.split('@')[0];
			}
		}

		if (
			this.props.currentUser &&
			discussionComment.voters &&
			discussionComment.voters.indexOf(this.props.currentUser._id) >= 0
		) {
			userUpvoted = true;
		}

		if (
			this.props.currentUser &&
			discussionComment.usersReported &&
			discussionComment.reported > 0 &&
			discussionComment.usersReported.indexOf(this.props.currentUser._id) >= 0
		) {
			userReported = true;
		}

		if (this.state.moreOptionsVisible) {
			offsetLeft = $('.toggle-more-button').position().left;
		}

		// Make status message if applicable
		if (discussionComment.status === 'pending') {
			status = 'Pending approval';
		} else if (discussionComment.status === 'trash') {
			status = 'This comment was made private by an Administrator.';
		}

		return (
			<div className={`discussion-comment paper-shadow ${(userReported && !this.state.readComment ? 'discussion-comment--user-reported' : '')}`}>
				{status ?
					<span className="discussion-comment-status">
						{status}
					</span>
				: ''}
				<div className="discussion-comment-content">
					<div className="inner-comment-row">
						<div className="discussion-commenter-profile-picture profile-picture paper-shadow">
							<a href={userLink}>
								<img
									src={user && user.profile ?
										user.profile.avatarUrl : '/images/default_user.jpg'}
									alt={username}
								/>
							</a>
						</div>

						<div className="discussion-commenter-meta">
							<a href={userLink}>
								<span className="discussion-commenter-name">
									{username}
								</span>
							</a>
							<span className="discussion-comment-date">
								<span>{discussionComment.updated ? 'Updated: ' : 'Created: '}</span>
								{moment(discussionComment.updated ||
									discussionComment.created).format('D MMMM YYYY')}
							</span>
						</div>

					</div>
					<div className="inner-comment-row">
						<div className="discussion-comment-text">
							{/* <div
							 dangerouslySetInnerHTML={{ __html: discussionComment.content}}
							 ></div> */}
							{this.state.editMode ?
								<form
									className="update-comment-form clearfix"
									name="update-comment-form"
									ref={(component) => { this.updateCommentForm = component; }}
								>
									<textarea
										className="new-comment-text"
										defaultValue={this.props.discussionComment.content}
									/>
									<div className="comment-edit-buttons">
										<RaisedButton
											label="Update"
											className="submit-comment-button paper-shadow"
											onClick={this.updateDiscussionComment}
										/>
										<FlatButton
											label="Close"
											className="close-form-button"
											onClick={this.closeEditMode}
										/>
									</div>
								</form>
								:
								<div>
									{discussionComment.content}
								</div>
							}
						</div>
					</div>
					<div className="inner-comment-row">
						{this.state.readComment === false ?
							<FlatButton
								label={discussionComment.votes}
								onClick={this.upvoteDiscussionComment}
								className={`discussion-comment-button vote-up ${(userUpvoted) ? 'upvoted' : ''}`}
								icon={<FontIcon className="mdi mdi-chevron-up" />}
								disabled={userUpvoted}
							>
								{!userIsLoggedIn ?
									<span className="md-tooltip">You must be signed in to vote.</span>
									:
									''
								}
							</FlatButton>
							:
							''
						}
						{(
								'currentUser' in self.props
							&& self.props.currentUser
							&& user
							&& self.props.currentUser._id === user._id
						) ?
							<FlatButton
								label="Edit"
								onClick={this.showEditMode}
								className="discussion-comment-button edit"
							/>
						:
							''
						}
						{this.state.readComment === false ?
							<FlatButton
								onClick={this.toggleMoreOptions}
								label=""
								className={`discussion-comment-button toggle-more-button ${(this.state.moreOptionsVisible) ? 'toggle-more-button--active' : ''}`}
								icon={<FontIcon className="mdi mdi-dots-horizontal" />}
							>
								<span className="md-tooltip">Show more</span>
							</FlatButton>
							:
							''
						}

						<div
							className={`more-options ${this.state.moreOptionsVisible ? 'more-options--visible' : ''}`}
							style={{
								left: offsetLeft,
							}}
						>
							<FlatButton
								label="Report"
								onClick={this.reportDiscussionComment}
								className={`discussion-comment-button report ${(userReported) ? 'reported' : ''}`}
								icon={<FontIcon className="mdi mdi-flag" />}
							>
								{!userIsLoggedIn ?
									<span className="md-tooltip">
										You must be signed in to report a comment.
									</span>
									:
									''
								}
							</FlatButton>
						</div>
						{this.state.readComment === true ?
							<FlatButton
								label="Unreport"
								onClick={this.unreportDiscussionComment}
							/>
							: ''
						}
					</div>


					{/* false ?
						<div className="reply-create-form">
							<div className="add-comment-wrap">
								<form
									className="new-comment-form"
									name="new-comment-form"
								>
									<div className="add-comment-row-1">
										<textarea
											className="new-comment-text"
											placeholder="Enter your reply here . . . "
										/>
										<RaisedButton
											label="Submit"
											type="submit"
											className="submit-comment-button paper-shadow"
										/>
										<RaisedButton
											label="Close Reply"
											className="close-form-button"
											onClick={this.closeReply}
										/>
									</div>
								</form>
							</div>
						</div>
						: '' */}

					<div className="discussion-comment-children">

						{discussionComment.children.map((discussionCommentChild, j) =>
							<div
								key={j}
								className="discussion-comment discussion-comment-child"
							>
								<div className="inner-comment-row">
									<div className="discussion-commenter-profile-picture profile-picture paper-shadow">
										<img src="/images/default_user.png" alt={username} />
									</div>
									<div className="discussion-commenter-meta">
										<span className="discussion-commenter-name">
											{discussionCommentChild.user.name}
										</span>
										<span className="discussion-comment-date">
											{discussionCommentChild.updated}
										</span>
									</div>
								</div>
								<div className="inner-comment-row">
									<div className="discussion-comment-text">
										<p
											dangerouslySetInnerHTML={{
												__html: discussionCommentChild.content,
											}}
										/>
									</div>
								</div>
								<div className="inner-comment-row">
									<FlatButton
										label={discussionComment.votes}
										onClick={this.upvoteDiscussionComment}
										className="vote-up upvoted"
										icon={<FontIcon className="mdi mdi-chevron-up" />}
									/>
									<FlatButton
										label="Reply"
										onClick={this.showReplyForm}
										className="reply"
									/>
									<FlatButton
										label="Edit"
										onClick={this.editDiscussionComment}
										className="edit"
									/>
									<FlatButton
										label="Remove"
										onClick={this.removeDiscussionComment}
										className="remove"
									/>
								</div>

								{/* <!-- .discussion-comment-child --> */}
							</div>
						)}
						{/* <!-- .discussion-comment-children --> */}
					</div>
					{/* <!-- .discussion-comment --> */}
				</div>
				<div className="discussion-comment-user-reported-message">
					You reported this comment.
					<div>
						<FlatButton
							label="Read"
							onClick={this.readDiscussionComment}
						/>
						<FlatButton
							label="Unreport"
							onClick={this.unreportDiscussionComment}
						/>
					</div>
				</div>
			</div>
		);
	},

});
