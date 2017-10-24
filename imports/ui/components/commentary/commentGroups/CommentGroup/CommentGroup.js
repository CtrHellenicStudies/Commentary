import React from 'react';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';

// layouts:
import CommentDetail from '/imports/ui/components/commentary/comments/CommentDetail';
import CommentLemma from '/imports/ui/components/commentary/commentGroups/CommentLemma';


class CommentGroup extends React.Component {
	static propTypes = {
		commentGroup: PropTypes.shape({
			work: PropTypes.shape({
				slug: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
			}),
			subwork: PropTypes.shape({
				n: PropTypes.number.isRequired,
			}),
			lineFrom: PropTypes.number.isRequired,
			lineTo: PropTypes.number,
			commenters: PropTypes.arrayOf(PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
				avatar: PropTypes.shape({
					src: PropTypes.string,
				})
			}))
		}).isRequired,
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
		multiline: PropTypes.bool,
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
