import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import Parser from 'simple-text-parser';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { debounce } from 'throttle-debounce';
import { compose } from 'react-apollo';

import { commentsQuery, commentsMoreQuery } from '/imports/graphql/methods/comments';
import { commentersQuery } from '/imports/graphql/methods/commenters';


// models:
import Comments from '/imports/models/comments';
import Settings from '/imports/models/settings';
import Works from '/imports/models/works';

// layouts:
import CommentGroup from '/imports/ui/components/commentary/commentGroups/CommentGroup';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';

// components:
import InfiniteScroll from '/imports/ui/components/shared/InfiniteScroll';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';

// lib
import RaisedButton from 'material-ui/RaisedButton';
import Utils from '/imports/lib/utils';
import muiTheme from '/imports/lib/muiTheme';

// helpers:
import { getCommentsQuery, parseCommentsToCommentGroups } from './helpers';


class Commentary extends Component {
	static propTypes = {
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
		commentersQuery: PropTypes.object,
		commentGroups: PropTypes.array,
		commentsMoreQuery: PropTypes.object,
		ready: PropTypes.bool,
		settings: PropTypes.shape({
			title: PropTypes.string,
		}),
	};

	static defaultProps = {
		isOnHomeView: false,
		filters: null,
		showLoginModal: null,
		toggleSearchTerm: null,
		loadMoreComments: null,
	};

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
		// methods:
		this.toggleLemmaEdition = this.toggleLemmaEdition.bind(this);
		this.removeLemma = this.removeLemma.bind(this);
		this.returnLemma = this.returnLemma.bind(this);
		this.searchReferenceLemma = this.searchReferenceLemma.bind(this);
		this.showContextPanel = this.showContextPanel.bind(this);
		this.closeContextPanel = this.closeContextPanel.bind(this);
		this.setContextScrollPosition = this.setContextScrollPosition.bind(this);
		this.setPageTitleAndMeta = this.setPageTitleAndMeta.bind(this);
		this.loadMoreComments = this.loadMoreComments.bind(this);
		this.renderNoCommentsOrLoading = this.renderNoCommentsOrLoading.bind(this);
		this.selectMultiLine = this.selectMultiLine.bind(this);


	}
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}
	raiseLimit() {

	}
	setPageTitleAndMeta() {

		const { filters, settings } = this.props;
		const commentGroups = this.props.commentsQuery ? [] : parseCommentsToCommentGroups(this.props.commentsQuery.comments);

		let title = '';
		let values = [];
		let work = '';
		const workDefault = 'Commentary';
		let subwork = null;
		let lineFrom = 0;
		let lineTo = 0;
		let metaSubject = 'Commentaries on Classical Texts';
		let description = '';

		if (!settings) {
			return null;
		}

		filters.forEach((filter) => {
			values = [];
			switch (filter.key) {
			case 'works':
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				work = values.join(', ');
				break;

			case 'subworks':
				filter.values.forEach((value) => {
					values.push(value.n);
				});
				subwork = values.join(', ');
				break;

			case 'lineFrom':
				lineFrom = filter.values[0];
				break;

			case 'lineTo':
				lineTo = filter.values[0];
				break;
			default:
				break;
			}
		});

		const foundWork = Works.findOne({ slug: work });
		if (foundWork) {
			title = foundWork.title;
		} else {
			title = workDefault;
		}

		if (subwork) title = `${title} ${subwork}`;
		if (lineFrom) {
			if (lineTo) {
				title = `${title}.${lineFrom}-${lineTo}`;
			} else {
				title = `${title}.${lineFrom}`;
			}
		} else if (lineTo) {
			title = `${title}.${lineTo}`;
		} else {
			title = `${title}`;
		}
		title = `${title} | ${settings.title || ''}`;

		metaSubject = `${metaSubject}, ${title}, Philology`;

		if (
			commentGroups.length
			&& commentGroups[0].comments.length
			&& commentGroups[0].comments[0].revisions.length
		) {
			description = Utils.trunc(commentGroups[0].comments[0].revisions[0].text, 120);
		}

		Utils.setMetaTag('name', 'subject', 'content', metaSubject);
		Utils.setTitle(title);
		Utils.setDescription(`Commentary on ${title}: ${description}`);
		Utils.setMetaImage();
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

	loadMoreComments() {
		if (
			!this.props.isOnHomeView
			&& this.props.commentsMoreQuery.commentsMore
		) {
			this.props.loadMoreComments();
		}
	}
	renderNoCommentsOrLoading() {
		const { isOnHomeView, commentGroups } = this.props;

		if (
			!isOnHomeView
		) {
			if (!this.props.commentsMoreQuery.commentsMore) {
				return (
					<div className="no-commentary-wrap">
						<p className="no-commentary no-results">
							No commentary available for the current search.
						</p>
					</div>
				);
			}
			if (!this.props.ready) {
				return (
					<div className="ahcip-spinner commentary-loading">
						<div className="double-bounce1" />
						<div className="double-bounce2" />
					</div>
				);
			}
		}
	}
	render() {
		const { isOnHomeView, toggleSearchTerm, showLoginModal, filters, commentGroups } = this.props;
		const { contextPanelOpen, contextCommentGroupSelected, commentLemmaIndex } = this.state;
		if (!isOnHomeView) {
			this.setPageTitleAndMeta();
		}
		if (!commentGroups) {
			return null;
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
							history={this.props.history}
							selectMultiLine={this.selectMultiLine}
							multiline={this.state.multiline}
						/>
					))}
				</div>
				<div className="read-more-link">
					<RaisedButton
						onClick={this.loadMoreComments}
						className="cover-link show-more commentary-raise-button"
						label="Read More"
					/>
				</div>
				{/* --- END comments list */}

				{this.renderNoCommentsOrLoading()}

				{'work' in contextCommentGroupSelected ?
					<ContextPanel
						open={contextPanelOpen}
						closeContextPanel={this.closeContextPanel}
						commentGroup={contextCommentGroupSelected}
						commentLemmaIndex={commentLemmaIndex}
						multiline={this.state.multiline}
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
const cont = createContainer(props => {
	const { tenantId, filters, limit, skip } = props;
	const properties = {
		limit: limit,
		skip: skip
	};
	if (props.tenantId && Utils.shouldRefetchQuery(properties, props.commentersQuery.variables)) {
		properties.queryParam = getCommentsQuery(filters, tenantId);

		props.commentsQuery.refetch(properties);
		props.commentsMoreQuery.refetch(properties);
	}

	const commentGroups = props.commentersQuery.loading || props.commentsQuery.loading ? 
		[] : parseCommentsToCommentGroups(props.commentsQuery.comments,
			props.commentersQuery.commenters);	
	return {
		commentGroups,
		ready: !props.commentsQuery.loading && !props.commentersQuery.loading && !props.commentsMoreQuery.loading
	};
}, Commentary);
export default compose(
	commentsQuery,
	commentersQuery,
	commentsMoreQuery
)(cont);

