import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { debounce } from 'throttle-debounce';
import Comments from '/imports/collections/comments';
import InfiniteScroll from '/imports/ui/components/InfiniteScroll.jsx';

Commentary = React.createClass({

	propTypes: {
		isOnHomeView: React.PropTypes.bool,
		filters: React.PropTypes.array.isRequired,
		commentsReady: React.PropTypes.bool,
		showLoginModal: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
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
			commentGroups: [],
			skip: 0,
			limit: 10,
		};
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(baseTheme),
		};
	},

	getMeteorData() {
		let commentGroups = [];
		const query = this.createQueryFromFilters(this.props.filters);
		query['tenantId'] = Session.get("tenantId");

		// SUBSCRIPTIONS:
		const commentsSub = Meteor.subscribe('comments', query, this.state.skip, this.state.limit);
		let isMoreComments = true;

		// FETCH DATA:
		const comments = Comments.find({}, {
			sort: {
				'work.order': 1,
				'subwork.n': 1,
				lineFrom: 1,
				nLines: -1,
			},
		}).fetch();

		commentGroups = this.parseCommentsToCommentGroups(comments);

		if (comments.length < this.state.limit) {
			isMoreComments = false;
		}

		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			commentGroups,
			isMoreComments,
			loading: commentsSub.ready(),
			settings: settingsHandle.ready() ? Settings.findOne() : {},
		};
	},

	parseCommentsToCommentGroups(comments) {
		const commentGroups = [];
		// Make comment groups from comments
		let isInCommentGroup = false;
		comments.forEach((comment) => {
			isInCommentGroup = false;
			commentGroups.forEach((commentGroup) => {
				if (
					comment.work.title === commentGroup.work.title
					&& comment.subwork.n === commentGroup.subwork.n
					&& comment.lineFrom === commentGroup.lineFrom
					&& comment.lineTo === commentGroup.lineTo
				) {
					isInCommentGroup = true;
					commentGroup.comments.push(comment);
				}
			});

			if (!isInCommentGroup) {
				let ref;

				if (comment.work.title === 'Homeric Hymns') {
					ref = `Hymns ${comment.subwork.n}.${comment.lineFrom}`;
				} else {
					ref = `${comment.work.title} ${comment.subwork.n}.${comment.lineFrom}`;
				}

				commentGroups.push({
					ref,
					selectedLemmaEdition: {
						lines: [],
					},
					work: comment.work,
					subwork: comment.subwork,
					lineFrom: comment.lineFrom,
					lineTo: comment.lineTo,
					nLines: comment.nLines,
					comments: [comment],
				});
			}
		});

		// Unique commenters for each comment group
		commentGroups.forEach((commentGroup, commentGroupIndex) => {
			// let isInCommenters = false;
			const commenters = [];
			// const commenterSubscription = Meteor.subscribe('commenters', Session.get("tenantId"));
			commentGroup.comments.forEach((comment, commentIndex) => {
				// isInCommenters = false;

				comment.commenters.forEach((commenter, i) => {
					const commenterRecord = Commenters.findOne({
						slug: commenter.slug,
					});
					if (commenterRecord) {
						commentGroups[commentGroupIndex].comments[commentIndex].commenters[i] = commenterRecord;

						// get commenter avatar
						if (commenterRecord.avatar) {
							commenterRecord.avatar = commenterRecord.avatar;
						}

						// add to the unique commenter set
						if (commenters.some((c) => c.slug === commenter.slug)) {
							// isInCommenters = true;
						} else {
							commenters.push(commenterRecord);
						}
					}
				});
			});
			commentGroups[commentGroupIndex].commenters = commenters;
		});

		return commentGroups;
	},

	createQueryFromFilters(filters) {
		const query = {};
		let values = [];
		if (filters) {
			filters.forEach((filter) => {
				switch (filter.key) {
				case '_id':
					query._id = filter.values[0];
					break;
				case 'textsearch':
					query.$text = {
						$search: filter.values[0],
					};
					break;
				case 'keyideas':
				case 'keywords':
					values = [];
					filter.values.forEach((value) => {
						values.push(value.slug);
					});
					query['keywords.slug'] = {
						$in: values,
					};
					break;

				case 'commenters':
					values = [];
					filter.values.forEach((value) => {
						values.push(value.slug);
					});
					query['commenters.slug'] = {
						$in: values,
					};
					break;

				case 'reference':
					values = [];
					filter.values.forEach((value) => {
						values.push(value.title);
					});
					query.reference = {
						$in: values,
					};
					break;

				case 'works':
					values = [];
					filter.values.forEach((value) => {
						values.push(value.slug);
					});
					query['work.slug'] = {
						$in: values,
					};
					break;

				case 'subworks':
					values = [];
					filter.values.forEach((value) => {
						values.push(value.n);
					});
					query['subwork.n'] = {
						$in: values,
					};
					break;

				case 'lineFrom':
					// Values will always be an array with a length of one
					query.lineFrom = query.lineFrom || {};
					query.lineFrom.$gte = filter.values[0];
					break;

				case 'lineTo':
					// Values will always be an array with a length of one
					query.lineFrom = query.lineFrom || {};
					query.lineFrom.$lte = filter.values[0];
					break;

				case 'wordpressId':
					// Values will always be an array with a length of one
					query.wordpressId = filter.values[0];
					break;

				default:
					break;
				}
			});
		}

		return query;
	},

	toggleSearchTerm(key, value) {
		this.props.toggleSearchTerm(key, value);
		this.setState({
			skip: 0,
		});
	},

	loadMoreComments() {
		if (
			!this.props.isOnHomeView
		&& this.data.commentGroups.length
		&& this.data.isMoreComments
	) {
			this.setState({
				limit: this.state.limit + 10,
			});
		}
	},

	toggleLemmaEdition() {
		this.setState({
			selectedLemmaEdition: {},
		});
	},

	removeLemma() {
		if (this.state.hideLemmaPanel === false) {
			this.setState({
				hideLemmaPanel: true,
			});
		}
	},

	returnLemma() {
		if (this.state.hideLemmaPanel === true) {
			this.setState({
				hideLemmaPanel: false,
			});
		}
	},

	searchReferenceLemma() {
		this.setState({
			referenceLemma: [],
			referenceLemmaSelectedEdition: {
				lines: [],
			},
		});
	},

	showContextPanel(commentGroup) {
		this.setState({
			contextCommentGroupSelected: commentGroup,
			contextPanelOpen: true,
		});
	},

	closeContextPanel() {
		this.setState({
			contextCommentGroupSelected: {},
			contextPanelOpen: false,
		});
	},

	contextScrollPosition(scrollPosition, index) {
		this.setState({
			contextScrollPosition: scrollPosition,
			commentLemmaIndex: index,
		});
	},

	setPageTitleAndMeta() {
		let title = '';
		let values = [];
		let work = 'Commentary';
		let subwork = null;
		let lineFrom = 0;
		let lineTo = 0;
		let metaSubject = 'Commentaries on Classical Texts';
		let description = '';

		this.props.filters.forEach((filter) => {
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
		const workTitle = foundWork ? foundWork.title : work;
		const { settings } = this.data;

		title = workTitle;
		if (subwork) title = `${title} ${subwork}`;
		if (lineFrom) {
			if (lineTo) {
				title = `${title} ${lineFrom}-${lineTo}`;
			} else {
				title = `${title} ${lineFrom}`;
			}
		} else if (lineTo) {
			title = `${title} ${lineTo}`;
		} else {
			title = `${title}`;
		}
		title = `${title} | ${settings.title}`;

		metaSubject = `${metaSubject}, ${title}, Philology`;

		if (
				this.data.commentGroups.length
			&& this.data.commentGroups[0].comments.length
			&& this.data.commentGroups[0].comments[0].revisions.length
		) {
			description = Utils.trunc(Utils.getRevisionText(this.data.commentGroups[0].comments[0].revisions[0]), 120);
		}

		Utils.setMetaTag('name', 'subject', 'content', metaSubject);
		Utils.setTitle(title);
		Utils.setDescription(`Commentary on ${title}: ${description}`);
		Utils.setMetaImage();
	},

	renderNoCommentsOrLoading() {
		if (
				'isMoreComments' in this.data
			&& typeof this.data.isMoreComments !== 'undefined'
			&& this.data.isMoreComments
			&& !this.props.isOnHomeView
		) {
			if (this.data.commentGroups.length === 0 && !this.data.loading) {
				return (
					<div className="no-commentary-wrap">
						<p className="no-commentary no-results">
							No commentary available for the current search.
						</p>
					</div>
				);
			}

			return (
				<div className="ahcip-spinner commentary-loading">
					<div className="double-bounce1" />
					<div className="double-bounce2" />
				</div>
			);
		}

		return '';
	},

	render() {
		let isOnHomeView;
		if ('isOnHomeView' in this.props) {
			isOnHomeView = this.props.isOnHomeView;
		} else {
			isOnHomeView = false;
		}

		if (!isOnHomeView) {
			this.setPageTitleAndMeta();
		}


		return (
			<div className="commentary-primary content ">
				{/* --- BEGIN comments list */}
				<InfiniteScroll
					endPadding={120}
					loadMore={debounce(1000, this.loadMoreComments)}
				>
					<div className="commentary-comments commentary-comment-groups">
						{this.data.commentGroups.map((commentGroup, commentGroupIndex) => (
							<CommentGroup
								key={commentGroupIndex}
								commentGroupIndex={commentGroupIndex}
								commentGroup={commentGroup}
								contextPanelOpen={this.state.contextPanelOpen}
								showContextPanel={this.showContextPanel}
								contextScrollPosition={this.contextScrollPosition}
								toggleSearchTerm={this.toggleSearchTerm}
								showLoginModal={this.props.showLoginModal}
								filters={this.props.filters}
								isOnHomeView={this.props.isOnHomeView}
							/>
						))}
					</div>
				</InfiniteScroll>
				{/* --- END comments list */}

				{this.renderNoCommentsOrLoading()}

				{'work' in this.state.contextCommentGroupSelected ?
					<ContextPanel
						open={this.state.contextPanelOpen}
						closeContextPanel={this.closeContextPanel}
						commentGroup={this.state.contextCommentGroupSelected}
						scrollPosition={this.state.contextScrollPosition}
						commentLemmaIndex={this.state.commentLemmaIndex}
					/>
					: ''}
				{!isOnHomeView ?
					<FilterWidget
						filters={this.props.filters}
						toggleSearchTerm={this.toggleSearchTerm}
					/>
					: ''}
			</div>
		);
	},
});
