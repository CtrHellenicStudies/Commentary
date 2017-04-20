import { Session } from 'meteor/session';
import slugify from 'slugify';
import cookie from 'react-cookie';
import 'mdi/css/materialdesignicons.css';

// components:
import FilterWidget from '/imports/ui/components/commentary/FilterWidget'; // eslint-disable-line import/no-absolute-path

AddRevisionLayout = React.createClass({

	propTypes: {
		commentId: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			filters: [],
			contextReaderOpen: true,
		};
	},

	componentWillUpdate() {
		if (this.data.ready) this.handlePermissions();
	},

	getMeteorData() {
		const commentsSub = Meteor.subscribe('comments.id', this.props.commentId, Session.get('tenantId'));
		const commentersSub = Meteor.subscribe('commenters', Session.get('tenantId'));
		const keywordsSub = Meteor.subscribe('keywords.all');

		const ready = Roles.subscription.ready() && commentsSub.ready() && keywordsSub.ready() && commentersSub.ready();

		const comment = Comments.findOne();
		const commenters = [];
		if (comment) {
			comment.commenters.forEach((commenter) => {
				commenters.push(Commenters.findOne({
					slug: commenter.slug,
				}));
			});
		}

		return {
			ready,
			comment,
			commenters,
		};
	},

	addRevision(formData, textValue, textRawValue) {
		const self = this;
		const revision = {
			title: formData.titleValue,
			text: textValue,
			textRaw: textRawValue,
			created: new Date(),
			slug: slugify(formData.titleValue),
		};
		Meteor.call('comments.add.revision', this.props.commentId, revision, (err) => {
			if (err) {
				console.error('Error adding revision', err);
			}
			self.update(formData);
		});
		// TODO: handle behavior after comment added (add info about success)
	},

	update(formData) {
		this.addNewKeywordsAndIdeas(formData.keywordsValue, formData.keyideasValue, () => {
			// get keywords after they were created:
			const keywords = this.getKeywords(formData);
			const authToken = cookie.load('loginToken');

			let update = [{}];
			if (keywords) {
				update = {
					keywords,
					referenceWorks: formData.referenceWorks,
				};
			}

			Meteor.call('comment.update', authToken, this.props.commentId, update, (_err) => {
				if (_err) {
					console.error('Error updating comment after adding revision', _err);
				}

				FlowRouter.go(`/commentary/${this.data.comment._id}/edit`);
			});
		});
		// TODO: handle behavior after comment added (add info about success)
	},

	matchKeywords(keywords) {
		const matchedKeywords = [];
		if (keywords) {
			keywords.forEach((keyword) => {
				const foundKeyword = Keywords.findOne({
					title: keyword,
				});
				matchedKeywords.push(foundKeyword);
			});
		}
		return matchedKeywords;
	},

	addNewKeywordsAndIdeas(keywords, keyideas, next) {
		this.addNewKeywords(keywords, 'word', () => {
			this.addNewKeywords(keyideas, 'idea', () => next());
		});
	},

	addNewKeywords(keywords, type, next) {
		// TODO should be handled server-side
		if (keywords) {
			const token = cookie.load('loginToken');
			const newKeywordArray = [];
			keywords.forEach((keyword) => {
				const foundKeyword = Keywords.findOne({title: keyword});
				if (!foundKeyword) {
					const newKeyword = {
						title: keyword.label,
						slug: slugify(keyword.label),
						type,
						tenantId: Session.get('tenantId')
					};
					newKeywordArray.push(newKeyword);
				}
			});
			if (newKeywordArray.length > 0) {
				return Meteor.call('keywords.insert', token, newKeywordArray, (err) => {
					if (err) {
						console.log('Keywords insert error', err);
						return null;
					}
					return next();
				});
			}
			return next();
		}
		return next();
	},

	getKeywords(formData) {
		const keywords = [];
		this.matchKeywords(formData.keywordsValue).forEach((matchedKeyword) => {
			keywords.push(matchedKeyword);
		});
		this.matchKeywords(formData.keyideasValue).forEach((matchedKeyword) => {
			keywords.push(matchedKeyword);
		});
		return keywords;
	},

	closeContextReader() {
		this.setState({
			contextReaderOpen: false,
		});
	},

	openContextReader() {
		this.setState({
			contextReaderOpen: true,
		});
	},

	handlePermissions() {
		if (this.data.comment && this.data.commenters.length) {
			let isOwner = false;
			this.data.commenters.forEach((commenter) => {
				if (!isOwner) {
					isOwner = (~Meteor.user().commenterId.indexOf(commenter._id));
				}
			});
			if (!isOwner) {
				FlowRouter.go('/');
			}
		}
	},

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;

				filter.values.forEach((filterValue, j) => {
					if (filterValue._id === value._id) {
						valueIsInFilter = true;
						filterValueToRemove = j;
					}
				});

				if (valueIsInFilter) {
					filter.values.splice(filterValueToRemove, 1);
					if (filter.values.length === 0) {
						filterToRemove = i;
					}
				} else if (key === 'works') {
					filters[i].values = [value];
				} else {
					filter.values.push(value);
				}
			}
		});


		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}

		if (!keyIsInFilter) {
			filters.push({
				key,
				values: [value],
			});
		}

		this.setState({
			filters,
			skip: 0,
		});
	},

	handleChangeLineN(e) {
		const filters = this.state.filters;

		if (e.from > 1) {
			let lineFromInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filters[i].values = [e.from];
					lineFromInFilters = true;
				}
			});

			if (!lineFromInFilters) {
				filters.push({
					key: 'lineFrom',
					values: [e.from],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		if (e.to < 2100) {
			let lineToInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filters[i].values = [e.to];
					lineToInFilters = true;
				}
			});

			if (!lineToInFilters) {
				filters.push({
					key: 'lineTo',
					values: [e.to],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this.setState({
			filters,
		});
	},

	render() {
		const filters = this.state.filters;
		const comment = this.data.comment;

		return (
			<div>
				{this.data.ready && this.data.comment ?
					<div className="chs-layout chs-editor-layout add-comment-layout">

						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>

						<main>

							<div className="commentary-comments">
								<div className="comment-group">
									<CommentLemmaSelect
										ref={(component) => { this.commentLemmaSelect = component; }}
										selectedLineFrom={comment.lineFrom}
										selectedLineTo={(comment.lineFrom + comment.nLines) - 1}
										workSlug={comment.work.slug}
										subworkN={comment.subwork.n}
									/>

									<AddRevision
										submitForm={this.addRevision}
										update={this.update}
										comment={comment}
									/>

									<ContextReader
										open={this.state.contextReaderOpen}
										closeContextPanel={this.closeContextReader}
										workSlug={comment.work.slug}
										subworkN={comment.subwork.n}
										selectedLineFrom={comment.lineFrom}
										selectedLineTo={(comment.lineFrom + comment.nLines) - 1}
										initialLineFrom={comment.lineFrom}
										initialLineTo={((comment.lineFrom + comment.nLines) - 1) + 50}
										disableEdit
									/>
								</div>
							</div>


						</main>

						<FilterWidget
							filters={filters}
							toggleSearchTerm={this.toggleSearchTerm}
						/>

					</div>
					:
					<div className="ahcip-spinner commentary-loading full-page-spinner">
						<div className="double-bounce1" />
						<div className="double-bounce2" />
					</div>
				}
			</div>
		);
	},
});
