import React from 'react';
import { StickyContainer } from 'react-sticky';

// layouts:
import CommentDetail from '/imports/ui/components/commentary/comments/CommentDetail';
import CommentLemma from '/imports/ui/components/commentary/commentGroups/CommentLemma';


class CommentGroup extends React.Component {
	static propTypes = {
		commentGroup: React.PropTypes.shape({
			work: React.PropTypes.shape({
				slug: React.PropTypes.string.isRequired,
				title: React.PropTypes.string.isRequired,
			}),
			subwork: React.PropTypes.shape({
				n: React.PropTypes.number.isRequired,
			}),
			lineFrom: React.PropTypes.number.isRequired,
			lineTo: React.PropTypes.number,
			commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
				_id: React.PropTypes.string.isRequired,
				name: React.PropTypes.string.isRequired,
				slug: React.PropTypes.string.isRequired,
				avatar: React.PropTypes.shape({
					src: React.PropTypes.string,
				})
			}))
		}).isRequired,
		commentGroupIndex: React.PropTypes.string.isRequired,
		contextPanelOpen: React.PropTypes.bool.isRequired,
		showContextPanel: React.PropTypes.func.isRequired,
		setContextScrollPosition: React.PropTypes.func.isRequired,
		toggleSearchTerm: React.PropTypes.func,
		filters: React.PropTypes.arrayOf(React.PropTypes.shape({
			key: React.PropTypes.string.isRequired,
			values: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
		})),
		showLoginModal: React.PropTypes.func,
		isOnHomeView: React.PropTypes.bool,
	};

	static defaultProps = {
		toggleSearchTerm: null,
		filters: null,
		showLoginModal: null,
		isOnHomeView: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			hideLemma: false,
		};

		// methods:
		this.toggleLemma = this.toggleLemma.bind(this);
	}

	toggleLemma() {
		this.setState({
			hideLemma: !this.state.hideLemma,
		});
	}

	render() {
		const { commentGroup, commentGroupIndex, contextPanelOpen, showLoginModal,
			filters, showContextPanel, setContextScrollPosition, toggleSearchTerm } = this.props;
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
						/>

						{commentGroup.comments.map(comment => (
							<div
								key={comment._id}
							>
								<CommentDetail
									key={`${comment}-comment-detail`}
									comment={comment}
									toggleSearchTerm={!isOnHomeView ? toggleSearchTerm : null}
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

export default CommentGroup;
