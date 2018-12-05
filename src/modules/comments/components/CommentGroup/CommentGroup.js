import React from 'react';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';

// components
import CommentDetail from '../CommentDetail';
import CommentLemmaContainer from '../../containers/CommentLemmaContainer';

// cts
import serializeUrn from '../../../cts/lib/serializeUrn';


class CommentGroup extends React.Component {
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
		const {
			commentGroup, commentGroupIndex, contextPanelOpen, showLoginModal,
			showContextPanel, setContextScrollPosition, selectMultiLine, isOnHomeView,
			history, multiline
		} = this.props;
		const { hideLemma } = this.state;

		let commentsClass = 'comments ';
		if (contextPanelOpen) {
			commentsClass += 'lemma-panel-visible';
		}

		// TODO: use work from query
		// let workTitle = commentGroup.lemmaCitation.work;

		return (
			<div
				className="comment-group "
				data-ref={commentGroup.ref}
				id={`comment-group-${commentGroupIndex}`}

			>
				<div className={commentsClass}>
					<StickyContainer>
						<CommentLemmaContainer
							index={commentGroupIndex}
							commentGroup={commentGroup}
							showContextPanel={showContextPanel}
							setScrollPosition={setContextScrollPosition}
							hideLemma={hideLemma}
							selectMultiLine={selectMultiLine}
							multiline={multiline}
							textNodesUrn={serializeUrn(commentGroup.lemmaCitation)}
							workUrn={serializeUrn(commentGroup.lemmaCitation, 'work')}
							lemmaCitation={commentGroup.lemmaCitation}
						/>

						{commentGroup.comments.map(comment => (
							<CommentDetail
								key={comment._id}
								comment={comment}
								commenters={this.getCommentersOfComment(comment)}
								isOnHomeView={isOnHomeView}
								toggleLemma={this.toggleLemma}
								showLoginModal={showLoginModal}
								history={history}
							/>
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
		lemmaCitation: PropTypes.shape({
			textGroup: PropTypes.string,
			work: PropTypes.string,
			passageFrom: PropTypes.arrayOf(PropTypes.number),
			passageTo: PropTypes.arrayOf(PropTypes.number),
		}),
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
	showLoginModal: PropTypes.func,
	isOnHomeView: PropTypes.bool,
	multiline: PropTypes.string,
};

CommentGroup.defaultProps = {
	showLoginModal: null,
	isOnHomeView: false,
};

export default CommentGroup;
