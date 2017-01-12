import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Avatars } from '/imports/avatar/avatar_collections.js';
import { debounce } from 'throttle-debounce';
import InfiniteScroll from '/imports/InfiniteScroll.jsx';

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

	componentDidMount() {
		window.addEventListener('resize', this.handleScroll);
		window.addEventListener('scroll', this.handleScroll);
	},

	getMeteorData() {
		const commentGroups = [];
		const query = this.createQueryFromFilters(this.props.filters);

		// SUBSCRIPTIONS:
		const commentsSub = Meteor.subscribe('comments', query, this.state.skip, this.state.limit);
		let loading = true;
		let isMoreComments = true;

		// FETCH DATA:
		if (commentsSub.ready()) {
			const comments = Comments.find({}, {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
			}).fetch();
			// const commentGroups = [];

			if (comments.length < this.state.limit) {
				isMoreComments = false;
			}

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
				const avatarSubscription = Meteor.subscribe('avatars.commenter.all');
				// const commenterSubscription = Meteor.subscribe('commenters');
				if (avatarSubscription.ready()) {
					commentGroup.comments.forEach((comment, commentIndex) => {
						// isInCommenters = false;

						comment.commenters.forEach((commenter, i) => {
							const commenterRecord = Commenters.findOne({
								slug: commenter.slug,
							});
							commentGroups[commentGroupIndex].comments[commentIndex].commenters[i] = commenterRecord;

							// get commenter avatar
							if (commenterRecord.avatar) {
								commenterRecord.avatarData = Avatars.findOne(commenterRecord.avatar);
							}

							// add to the unique commenter set
							if (commenters.some((c) => c.slug === commenter.slug)) {
								// isInCommenters = true;
							} else {
								commenters.push(commenterRecord);
							}
						});
					});
				}

				commentGroups[commentGroupIndex].commenters = commenters;
			});
			loading = false;
		}

		return {
			commentGroups,
			loading,
			isMoreComments,
		};
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

	handleScroll() {
		const scrollY = window.scrollY;
		this.data.commentGroups.forEach((commentGroup, i) => {
			const id = `#comment-group-${i}`;
			const offset = $(id).offset();
			const height = $(`${id} .comments`).height();
			const element = $(id).find(
				'.comment-group-meta-inner,.comment-group-meta-inner-fixed,.comment-group-meta-inner-bottom'
			);
			if (offset && offset.top && scrollY < offset.top) {
				element.addClass('comment-group-meta-inner');
				element.removeClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner-bottom');
			} else if (offset && offset.top && scrollY >= offset.top && scrollY < (offset.top + height) - 275) {
				element.addClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner');
				element.removeClass('comment-group-meta-inner-bottom');
			} else {
				element.addClass('comment-group-meta-inner-bottom');
				element.removeClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner');
			}
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
