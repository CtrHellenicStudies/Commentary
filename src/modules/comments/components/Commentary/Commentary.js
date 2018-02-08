import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts
import CommentGroup from '../CommentGroup';
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';

// components
import FilterWidget from '../../../filters/FilterWidget';

// lib
import muiTheme from '../../../../lib/muiTheme';

// helpers
import setPageTitleAndMeta from '../../lib/setPageTitleAndMeta';


class Commentary extends Component {

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
			isOnHomeView, toggleSearchTerm, showLoginModal, filters, settings, history,
			commentGroups,
		} = this.props;
		const {
			contextPanelOpen, contextCommentGroupSelected, commentLemmaIndex, multiline,
		} = this.state;

		// set page title and metadata
		if (!isOnHomeView) {
			setPageTitleAndMeta(filters, settings, commentGroups);
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
							toggleSearchTerm={toggleSearchTerm}
							showLoginModal={showLoginModal}
							filters={filters}
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
					/>
				</div>
				{/* --- END comments list */}

				{'work' in contextCommentGroupSelected ?
					<ContextPanel
						open={contextPanelOpen}
						closeContextPanel={this.closeContextPanel}
						commentGroup={contextCommentGroupSelected}
						commentLemmaIndex={commentLemmaIndex}
						multiline={multiline}
					/>
				: ''}

				{!isOnHomeView ?
					<FilterWidget
						filters={filters}
						toggleSearchTerm={toggleSearchTerm}
					/>
				: ''}
			</div>
		);
	}
}

Commentary.propTypes = {
	skip: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
	limit: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
	isOnHomeView: PropTypes.bool,
	filters: PropTypes.array,
	showLoginModal: PropTypes.func,
	toggleSearchTerm: PropTypes.func,
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
	filters: null,
	showLoginModal: null,
	toggleSearchTerm: null,
	loadMoreComments: null,
};

export default withRouter(Commentary);
