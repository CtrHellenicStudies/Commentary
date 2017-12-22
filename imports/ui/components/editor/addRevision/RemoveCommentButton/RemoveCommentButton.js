import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import FlatButton from 'material-ui/FlatButton';
import { compose } from 'react-apollo';

// graphql
import { commentsRemoveMutation } from '/imports/graphql/methods/comments';

class RemoveCommentButton extends React.Component {

	removeComment() {
		const authToken = Cookies.get('loginToken');
		this.commentsRemove(this.props.commentId);
	}


	render() {
		return (
			<div className="comment-action-button">
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

export default compose(commentsRemoveMutation)(RemoveCommentButton);
