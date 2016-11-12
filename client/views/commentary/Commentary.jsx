import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Avatars } from '/imports/avatar/avatar_collections.js';
import InfiniteScroll from '/imports/InfiniteScroll.jsx';

Commentary = React.createClass({

	propTypes: {
		isOnHomeView: React.PropTypes.bool,
		filters: React.PropTypes.array,
		addSearchTerm: React.PropTypes.func,
		loadMoreComments: React.PropTypes.func,
		skip: React.PropTypes.number,
		limit: React.PropTypes.number,
		toggleSearchTerm: React.PropTypes.func,
		contextScrollPosition: React.PropTypes.number,
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
			referenceLemmaSelectedEdition: { lines: [] },
			commentLemmaGroups: [],

		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		this.textServerEdition = new Meteor.Collection('textServerEdition');
		window.addEventListener('resize', this.handleScroll);
		window.addEventListener('scroll', this.handleScroll);
	},

	getMeteorData() {
		const query = {};
		let comments = [];
		const commentGroups = [];
		let values = [];
		// Parse the filters to the query
		this.props.filters.forEach((filter) => {
			switch (filter.key) {
			case '_id':
				query._id = filter.values[0];
				break;
			case 'textsearch':
				query.$text = { $search: filter.values[0] };
				break;

			case 'keywords':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.wordpressId);
				});
				query['keywords.wordpressId'] = { $in: values };
				break;

			case 'commenters':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.wordpressId);
				});
				query['commenters.wordpressId'] = { $in: values };
				break;

			case 'works':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['work.slug'] = { $in: values };
				break;

			case 'subworks':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.n);
				});
				query['subwork.n'] = { $in: values };
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

		// console.log("Commentary query:", query);
		const handle = Meteor.subscribe('comments', query, this.props.skip, 10);
		if (handle.ready()) {
			comments = Comments.find({}, {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
			}).fetch();
			// console.log("Commentary comments:", comments);
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
					selectedLemmaEdition: { lines: [] },
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
			const commenters = [];

			const avatarSubscription = Meteor.subscribe('avatars.commenter.all');
			const commenterSubscription = Meteor.subscribe('commenters');
			if (avatarSubscription.ready() && commenterSubscription.ready()) {
				commentGroup.comments.forEach((comment, commentIndex) => {
					comment.commenters.forEach((commenter, i) => {
						const commenterRecord = Commenters.findOne({ slug: commenter.slug });
						comments[commentIndex].commenters[i] = commenterRecord;

						// get commenter avatar
						if (commenterRecord.avatar) {
							commenterRecord.avatarData = Avatars.findOne(commenterRecord.avatar);
						}

						// add to the unique commenter set
						if (commenters.some((c) => c.slug === commenter.slug)) {
							// do nothing
						} else {
							commenters.push(commenterRecord);
						}
					});
				});
			}

			commentGroups[commentGroupIndex].commenters = commenters;
		});

		return {
			commentGroups,
		};
	},

	commentGroups: [],

	handleScroll() {
		const scrollY = window.scrollY;
		this.data.commentGroups.map((commentGroup, i) => {
			const id = `#comment-group-${i}`;
			const offset = $(id).offset();
			const height = $(`${id} .comments`).height();
			// var element = $(id + " .comment-group-meta-inner");
			const element = $(id).find('.comment-group-meta-inner,' +
				'.comment-group-meta-inner-fixed,.comment-group-meta-inner-bottom');
			if (offset && scrollY < offset.top) {
				element.addClass('comment-group-meta-inner');
				element.removeClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner-bottom');
				// element.removeClass("fixed");
				// element.css("top", "115px");
			} else if (scrollY >= offset.top && scrollY < (offset.top + height) - 275) {
				element.addClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner');
				element.removeClass('comment-group-meta-inner-bottom');
				// element.addClass("fixed");
				// element.css("top", "115px");
			} else {
				element.addClass('comment-group-meta-inner-bottom');
				element.removeClass('comment-group-meta-inner-fixed');
				element.removeClass('comment-group-meta-inner');
				// element.removeClass("fixed");
				// element.css("top", height - 160 + "px");
			}
			return null;
		});
	},

	loadMoreComments() {
		if (!this.props.isOnHomeView && this.commentGroups.length) {
			this.props.loadMoreComments();
		}
	},

	toggleLemmaEdition() {
		this.setState({
			selectedLemmaEdition: {},
		});
	},

	searchReferenceLemma() {
		this.setState({
			referenceLemma: [],
			referenceLemmaSelectedEdition: { lines: [] },
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

	render() {
		const self = this;
		const moreCommentaryLeft = true;
		let isOnHomeView;
		let commentsClass = 'comments ';

		if ('isOnHomeView' in this.props) {
			isOnHomeView = this.props.isOnHomeView;
		} else {
			isOnHomeView = false;
		}

		if (this.state.contextPanelOpen) {
			commentsClass += 'lemma-panel-visible';
		}

		// console.log("Commentary comments:", this.data.commentGroups);
		// console.log("Commentary.props.skip", this.props.skip);

		if (
			this.commentGroups.length === 0
			|| this.props.skip === 0
		) {
			$('html, body').animate({ scrollTop: 0 }, 'fast');
			this.commentGroups = [];
			this.commentGroups = this.data.commentGroups;
		} else {
			this.data.commentGroups.forEach((dataCommentGroup) => {
				let isInCommentGroups = false;
				self.commentGroups.forEach((commentGroup) => {
					if (dataCommentGroup.ref === commentGroup.ref) {
						isInCommentGroups = true;

						dataCommentGroup.comments.forEach((dataComment) => {
							let isInCommentGroup = false;

							commentGroup.comments.forEach((comment) => {
								if (dataComment._id === comment._id) {
									isInCommentGroup = true;
								}
							});

							if (!isInCommentGroup) {
								commentGroup.comments.push(dataComment);
							}
						});
					}
				});

				if (!isInCommentGroups) {
					self.commentGroups.push(dataCommentGroup);
				}
			});
		}

		// console.log("Commentary.commentGroups", this.commentGroups);

		return (
			<div className="commentary-primary content ">
				<InfiniteScroll
					endPadding={120}
					loadMore={this.loadMoreComments}
				>

					<div className="commentary-comments commentary-comment-groups">
						{this.commentGroups.map((commentGroup, i) => (
							<div
								className="comment-group "
								data-ref={commentGroup.ref}
								key={i}
								id={`comment-group-${i}`}
							>
								<div className={commentsClass}>

									<CommentLemma
										index={i}
										commentGroup={commentGroup}
										showContextPanel={self.showContextPanel}
										scrollPosition={self.contextScrollPosition}
									/>

									{commentGroup.comments.map((comment, j) => (
										<CommentDetail
											key={j}
											commentGroup={commentGroup}
											comment={comment}
											addSearchTerm={self.props.addSearchTerm}
											checkIfToggleLemmaReferenceModal={self.checkIfToggleLemmaReferenceModal}
											filters={self.props.filters}
										/>
									))}

								</div>
								{/* <!-- .comments -->*/}

								<hr className="comment-group-end" />

							</div>
						))}
					</div>

				</InfiniteScroll>

				{(!isOnHomeView && this.commentGroups.length > 0 && moreCommentaryLeft) ?
					<div className="ahcip-spinner commentary-loading">
						<div className="double-bounce1" />
						<div className="double-bounce2" />

					</div>
					: '' }

				{(this.data.loaded && this.commentGroups.length === 0) ?
					<div className="no-commentary-wrap">
						<p className="no-commentary no-results">
							No commentary available for the current search.
						</p>

					</div>
					: '' }

				<div className="lemma-reference-modal">
					<article className="comment	lemma-comment paper-shadow ">
						{this.state.referenceLemmaSelectedEdition.lines.map((line, i) => (
							<p
								key={i}
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: line.html }}
							/>
						))}

						<div className="edition-tabs tabs">
							{this.state.referenceLemma.map((lemmaTextEdition, i) => (
								<FlatButton
									key={i}
									label={edition.title}
									data-edition={edition.title}
									className="edition-tab tab"
									onClick={this.toggleLemmaEdition}
								/>
							))}

						</div>

						<i className="mdi mdi-close paper-shadow" onClick={this.hideLemmaReference} />
					</article>

				</div>
				{/* <!-- .lemma-reference-modal -->*/}

				{'work' in this.state.contextCommentGroupSelected ?
					<ContextPanel
						open={this.state.contextPanelOpen}
						closeContextPanel={this.closeContextPanel}
						commentGroup={this.state.contextCommentGroupSelected}
						scrollPosition={this.state.contextScrollPosition}
						commentLemmaIndex={this.state.commentLemmaIndex}
					/>
					: ''
				}
				{/* <!-- .commentary-primary -->*/}

				<FilterWidget
					filters={this.props.filters}
					toggleSearchTerm={this.props.toggleSearchTerm}
				/>

			</div>
		);
	},

});
