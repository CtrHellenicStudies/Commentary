import React from 'react';
import Cookies from 'js-cookie';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


class RemoveCommentButton extends React.Component {

	removeComment() {
		const authToken = Cookies.get('loginToken');

		Meteor.call('comment.delete', authToken, this.props.commentId, (err) => {
			if (err) {
				console.error(err);
				return false;
			}

			FlowRouter.go('/commentary');
		});
	}


	render() {
		return (
			<div className="comment-upper-action-button">
				<FlatButton
					label="Remove Comment"
					labelPosition="after"
					onClick={this.removeComment}
					style={{
						border: '1px solid #ddd',
						maxHeight: 'none',
						fontSize: '12px',
						height: 'auto',
					}}
				/>
			</div>
		);
	}
}

RemoveCommentButton.propTypes = {
	commentId: PropTypes.string.isRequired,
};

export default RemoveCommentButton;
