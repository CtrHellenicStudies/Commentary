import { StickyContainer } from 'react-sticky';

import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';

CommentGroup = React.createClass({

	propTypes: {
		commentGroup: React.PropTypes.object.isRequired,
		commentGroupIndex: React.PropTypes.number.isRequired,
		contextPanelOpen: React.PropTypes.bool.isRequired,
		showContextPanel: React.PropTypes.func.isRequired,
		contextScrollPosition: React.PropTypes.func.isRequired,
		toggleSearchTerm: React.PropTypes.func.isRequired,
		filters: React.PropTypes.array.isRequired,
		showLoginModal: React.PropTypes.func,
		isOnHomeView: React.PropTypes.bool,
	},

	getInitialState() {
		return {
			hideLemma: false,
		};
	},

	toggleLemma() {
		this.setState({
			hideLemma: !this.state.hideLemma,
		});
	},

	render() {
		const commentGroup = this.props.commentGroup;
		const commentGroupIndex = this.props.commentGroupIndex;
		let commentsClass = 'comments ';
		if (this.props.contextPanelOpen) {
			commentsClass += 'lemma-panel-visible';
		}
		if ('isOnHomeView' in this.props) {
			isOnHomeView = this.props.isOnHomeView;
		} else {
			isOnHomeView = false;
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
							showContextPanel={this.props.showContextPanel}
							scrollPosition={this.props.contextScrollPosition}
							hideLemma={this.state.hideLemma}
						/>

						{commentGroup.comments.map((comment, commentIndex) => (
							<div
								key={commentIndex}
							>
								<CommentDetail
									key={commentIndex}
									commentGroup={commentGroup}
									comment={comment}
									toggleSearchTerm={!isOnHomeView ? this.props.toggleSearchTerm : null}
									filters={this.props.filters}
									toggleLemma={this.toggleLemma}
									showLoginModal={this.props.showLoginModal}
								/>
							</div>
						))}

					</StickyContainer>

				</div>
				<hr className="comment-group-end" />
			</div>
		);
	},

});
