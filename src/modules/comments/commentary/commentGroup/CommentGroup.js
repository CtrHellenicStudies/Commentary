import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';

// layouts:
import CommentDetail from './commentDetail/CommentDetail';
import CommentLemma from './commentLemma/CommentLemma';



class CommentGroup extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hideLemma: false
		};

		// methods:
		this.toggleLemma = this.toggleLemma.bind(this);
		this.getCommentersOfComment = this.getCommentersOfComment.bind(this);
	}

	toggleLemma() {
		this.setState({
			hideLemma: !this.state.hideLemma,
		});
	}
	getCommentersOfComment(comment) {
		const commenters = {};
		comment.commenters.map((commenter) => {
			commenters[commenter._id] = this.props.commentGroup.commenters[commenter._id];
			return true;
		});
		return commenters;
	}
	render() {
		const { commentGroup, commentGroupIndex, contextPanelOpen, showLoginModal,
			filters, showContextPanel, setContextScrollPosition, toggleSearchTerm, selectMultiLine } = this.props;
		const { hideLemma } = this.state;
		
		let isOnHomeView = false;

		let commentsClass = 'comments ';
		if (contextPanelOpen) {
			commentsClass += 'lemma-panel-visible';
		}

		if ('isOnHomeView' in this.props) {
			isOnHomeView = this.props.isOnHomeView;
		}

		let workTitle = commentGroup.work.title;
		if (workTitle === 'Homeric Hymns') {
			workTitle = 'Hymns';
		}

		return (
			<div
				className="comment-group "
				data-ref={commentGroup.ref}
				id={`comment-group-${commentGroupIndex}`}

			>
				<div className={commentsClass}>
					<StickyContainer>
						<CommentLemma
							index={commentGroupIndex}
							commentGroup={commentGroup}
							showContextPanel={showContextPanel}
							setScrollPosition={setContextScrollPosition}
							hideLemma={hideLemma}
							selectMultiLine={selectMultiLine}
							multiline={this.props.multiline}
						/>

						{commentGroup.comments.map(comment => (
							<div
								key={comment._id}
							>
								<CommentDetail
									key={`${comment}-comment-detail`}
									comment={comment}
									commenters={this.getCommentersOfComment(comment)}
									toggleSearchTerm={!isOnHomeView ? toggleSearchTerm : null}
									isOnHomeView={this.props.isOnHomeView}
									filters={filters}
									toggleLemma={this.toggleLemma}
									showLoginModal={showLoginModal}
									history={this.props.history}
								/>
							</div>
						))}
					</StickyContainer>
				</div>
				<hr className="comment-group-end" />
			</div>
		);
	}
}
CommentGroup.propTypes = {
	commentGroup: PropTypes.shape({
		work: PropTypes.shape({
			slug: PropTypes.string,
			title: PropTypes.string,
		}),
		subwork: PropTypes.shape({
			n: PropTypes.number.isRequired,
		}),
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
		commenters: PropTypes.objectOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			avatar: PropTypes.shape({
				src: PropTypes.string,
			})
		}))
	}).isRequired,
	history: PropTypes.object,
	commentGroupIndex: PropTypes.string.isRequired,
	contextPanelOpen: PropTypes.bool.isRequired,
	showContextPanel: PropTypes.func.isRequired,
	setContextScrollPosition: PropTypes.func.isRequired,
	selectMultiLine: PropTypes.func.isRequired,
	toggleSearchTerm: PropTypes.func,
	filters: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		values: PropTypes.arrayOf(PropTypes.any).isRequired,
	})),
	showLoginModal: PropTypes.func,
	isOnHomeView: PropTypes.bool,
	multiline: PropTypes.string,
};
CommentGroup.defaultProps = {
	toggleSearchTerm: null,
	filters: null,
	showLoginModal: null,
	isOnHomeView: false,
};

export default CommentGroup;
