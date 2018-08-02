import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts
import CommentGroup from '../CommentGroup';
import ContextPanel from '../../../contextPanel/components/ContextPanel';

// components
import FilterWidget from '../../../filters/components/FilterWidget';

// lib
import muiTheme from '../../../../lib/muiTheme';
import setPageTitleAndMeta from '../../lib/setPageTitleAndMeta';

import './Commentary.css';


class Commentary extends React.Component {

	static childContextTypes = {
		muiTheme: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			contextCommentGroupSelected: {},
			contextPanelOpen: false,
			discussionSelected: {},
			discussionPanelOpen: false,
			referenceLemma: [],
			hideLemmaPanel: false,
			referenceLemmaSelectedEdition: {
				lines: [],
			},
			commentLemmaGroups: [],
			multiline: null
		};

		autoBind(this);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	raiseLimit() {

	}

	toggleLemmaEdition() {
		this.setState({
			selectedLemmaEdition: {},
		});
	}

	removeLemma() {
		if (this.state.hideLemmaPanel === false) {
			this.setState({
				hideLemmaPanel: true,
			});
		}
	}

	returnLemma() {
		if (this.state.hideLemmaPanel === true) {
			this.setState({
				hideLemmaPanel: false,
			});
		}
	}

	selectMultiLine(multiline) {
		this.setState({
			multiline: multiline
		});
	}

	searchReferenceLemma() {
		this.setState({
			referenceLemma: [],
			referenceLemmaSelectedEdition: {
				lines: [],
			},
		});
	}

	showContextPanel(commentGroup) {
		this.setState({
			contextCommentGroupSelected: commentGroup,
			contextPanelOpen: true,
		});
	}

	closeContextPanel() {
		this.setState({
			contextCommentGroupSelected: {},
			contextPanelOpen: false,
		});
	}

	setContextScrollPosition(index) {
		this.setState({
			commentLemmaIndex: index,
		});
	}

	render() {
		const {
			isOnHomeView, showLoginModal, settings, history, commentGroups,
		} = this.props;
		const {
			contextPanelOpen, contextCommentGroupSelected, commentLemmaIndex, multiline,
		} = this.state;

		// set page title and metadata
		if (!isOnHomeView) {
			setPageTitleAndMeta(settings, commentGroups);
		}

		return (
			<div className="commentary-primary content ">
				{/* --- BEGIN comments list */}
				<div className="commentary-comments commentary-comment-groups">
					{commentGroups.map(commentGroup => (
						<CommentGroup
							key={commentGroup._id}
							commentGroupIndex={commentGroup._id}
							commentGroup={commentGroup}
							contextPanelOpen={contextPanelOpen}
							showContextPanel={this.showContextPanel}
							setContextScrollPosition={this.setContextScrollPosition}
							showLoginModal={showLoginModal}
							isOnHomeView={isOnHomeView}
							history={history}
							selectMultiLine={this.selectMultiLine}
							multiline={multiline}
						/>
					))}
				</div>
				<div className="read-more-link">
					<RaisedButton
						onClick={this.props.loadMoreComments}
						className="cover-link show-more commentary-raise-button"
						label="Read More"
						primary
					/>
				</div>
				{/* --- END comments list */}

				{contextPanelOpen ?
					<ContextPanel
						open={contextPanelOpen}
						closeContextPanel={this.closeContextPanel}
						commentGroup={contextCommentGroupSelected}
						commentLemmaIndex={commentLemmaIndex}
						multiline={multiline}
					/>
					: ''}

				{!isOnHomeView ?
					<FilterWidget />
					: ''}
			</div>
		);
	}
}

Commentary.propTypes = {
	isOnHomeView: PropTypes.bool,
	showLoginModal: PropTypes.func,
	loadMoreComments: PropTypes.func,
	tenantId: PropTypes.string,
	history: PropTypes.object,
	commentsQuery: PropTypes.object,
	commentGroups: PropTypes.array,
	commentsMoreQuery: PropTypes.object,
	settings: PropTypes.shape({
		title: PropTypes.string,
	}),
};

Commentary.defaultProps = {
	isOnHomeView: false,
	showLoginModal: null,
	loadMoreComments: null,
};

export default withRouter(Commentary);
