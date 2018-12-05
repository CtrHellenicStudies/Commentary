import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { moment } from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { compose } from 'react-apollo';


// graphql
import discussionCommentUpdate from '../../graphql/mutations/discussionCommentUpdate';
import discussionCommentReport from '../../graphql/mutations/discussionCommentReport';
import discussionCommentUpvote from '../../graphql/mutations/discussionCommentUpvote';
import discussionCommentUnreport from '../../graphql/mutations/discussionCommentUnreport';

import './DiscussionComment.css';


class DiscussionComment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			editMode: false,
			moreOptionsVisible: false,
			shareOptionsVisible: false,
			readComment: false,
		};
		this.showEditMode = this.showEditMode.bind(this);
		this.closeEditMode = this.closeEditMode.bind(this);
		this.updateDiscussionComment = this.updateDiscussionComment.bind(this);
		this.upvoteDiscussionComment = this.upvoteDiscussionComment.bind(this);
		this.reportDiscussionComment = this.reportDiscussionComment.bind(this);
		this.unreportDiscussionComment = this.unreportDiscussionComment.bind(this);
		this.toggleMoreOptions = this.toggleMoreOptions.bind(this);
		this.toggleShareOptions = this.toggleShareOptions.bind(this);
		this.readDiscussionComment = this.readDiscussionComment.bind(this);
	}
	componentWillReceiveProps(props) {
		let user;

		if (props.discussionComment) {
			user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		}
		this.setState({user: user});
	}
	showEditMode() {
		this.setState({
			editMode: true,
		});
	}
	closeEditMode() {
		this.setState({
			editMode: false,
		});
	}
	updateDiscussionComment() {
		const content = $(this.updateCommentForm).find('textarea').val();
		const { discussionComment } = this.props;
		this.props.discussionCommentUpdate(discussionComment._id, content).catch((e) => {
			console.log(e);
		});
		this.setState({
			editMode: false,
		});
	}
	upvoteDiscussionComment() {
		const { currentUser, discussionComment } = this.props;
		if (currentUser) {
			this.props.discussionCommentUpvote(discussionComment._id).catch((e) => {
				console.log(e);
			});
		}
	}
	reportDiscussionComment() {
		const { currentUser, discussionComment } = this.props;
		if (currentUser) {
			this.setState({
				moreOptionsVisible: false,
			});
			this.props.discussionCommentReport(discussionComment._id).catch((e) => {
				console.log(e);
			});
		}
	}
	unreportDiscussionComment() {
		const { currentUser, discussionComment } = this.props;
		if (currentUser) {
			this.setState({
				readComment: false,
			});
			this.props.discussionCommentUnreport(discussionComment._id).catch((e) => {
				console.log(e);
			});
		}
	}
	toggleMoreOptions() {
		this.setState({
			moreOptionsVisible: !this.state.moreOptionsVisible,
			shareOptionsVisible: false,
		});
	}
	toggleShareOptions() {
		this.setState({
			shareOptionsVisible: !this.state.shareOptionsVisible,
			moreOptionsVisible: false,
		});
	}
	readDiscussionComment() {
		this.setState({
			readComment: true,
		});
	}
	render() {
		const self = this;
		const userIsLoggedIn = this.state.user;
		const { discussionComment, currentUser } = this.props;
		const { user } = this.state;
		let userLink = '';
		let userUpvoted = false;
		let userReported = false;
		let username = '';
		let offsetLeft = 0;
		let status;

		if (!discussionComment) {
			return null;
		}

		// Child discussion Comments
		discussionComment.children = [];

		// Make user link and user name
		if (user) {
			if (user.username) {
				username = user.username;
				userLink = `/users/${user._id}/${user.username}`;
			} else if (user.emails
			&& user.emails.length) {
				userLink = `/users/${user._id}`;
				username = user.emails[0].address.split('@')[0];
			}
		}

		if (currentUser &&
		discussionComment.voters &&
		discussionComment.voters.indexOf(currentUser._id) >= 0) {
			userUpvoted = true;
		}

		if (currentUser &&
		discussionComment.usersReported &&
		discussionComment.reported > 0 &&
		discussionComment.usersReported.indexOf(currentUser._id) >= 0) {
			userReported = true;
		}

		if (this.state.moreOptionsVisible) {
			offsetLeft = $('.toggle-more-button').position().left;
		}

		// Make status message if applicable
		if (discussionComment.status === 'pending') {
			status = 'Pending approval';
		} else if (discussionComment.status === 'trash') {
			status = 'This comment was made private by an Administrator';
		}

		let avatarUrl = '/images/default_user.jpg';
		if (user && user.profile && user.profile.avatarUrl) {
			avatarUrl = user.profile.avatarUrl;
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
							<Link to={userLink}>
								<img
									src={avatarUrl}
									alt={username}
								/>
							</Link>
						</div>

						<div className="discussion-commenter-meta">
							<Link to={userLink}>
								<span className="discussion-commenter-name">
									{username}
								</span>
							</Link>
							<span className="discussion-comment-date">
								<span>{discussionComment.updated ? 'Updated: ' : 'Created: '}</span>
								{ discussionComment.updated ||
									discussionComment.created ? moment().format('D MMMM YYYY'): ''}
							</span>
						</div>

					</div>
					<div className="inner-comment-row">
						<div className="discussion-comment-text">
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
							self.props.currentUser
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

					<div className="discussion-comment-children">

						{discussionComment.children.map((discussionCommentChild, j) =>
							(<div
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
							</div>)
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
	}

}
DiscussionComment.propTypes = {
	discussionComment: PropTypes.object.isRequired,
	currentUser: PropTypes.string,
	discussionCommentUpdate: PropTypes.func,
	discussionCommentUnreport: PropTypes.func,
	discussionCommentReport: PropTypes.func,
	discussionCommentUpvote: PropTypes.func,



};
export default compose(
	discussionCommentReport,
	discussionCommentUnreport,
	discussionCommentUpvote,
	discussionCommentUpdate)(DiscussionComment);
