import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';
import { ApolloProvider } from 'react-apollo';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createBrowserHistory } from 'history';

// api
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';

// components:
import Header from '/imports/ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';
import CommentLemmaSelect from '/imports/ui/components/editor/addComment/CommentLemmaSelect';
import AddRevision from '/imports/ui/components/editor/addRevision/AddRevision';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';

// lib
import muiTheme from '/imports/lib/muiTheme';
import client from '/imports/middleware/apolloClient';
import configureStore from '/imports/store/configureStore';
import Utils from '/imports/lib/utils';

// redux integration for layout
const store = configureStore();
const history = syncHistoryWithStore(createBrowserHistory(), store);

const AddRevisionLayout = React.createClass({

	propTypes: {
		ready: React.PropTypes.bool,
		comment: React.PropTypes.object,
		commenters: React.PropTypes.array,
		keywords: React.PropTypes.array,
	},

	getInitialState() {
		return {
			filters: [],
			contextReaderOpen: true,
			snackbarOpen: false,
			snackbarMessage: '',
		};
	},

	componentWillUpdate() {
		if (this.props.ready) this.handlePermissions();
	},

	addRevision(formData, textValue, textRawValue) {
		const self = this;
		const { comment } = this.props;
		const token = Cookies.get('loginToken');
		const revision = {
			title: formData.titleValue,
			text: textValue,
			textRaw: textRawValue,
			created: new Date(),
			slug: slugify(formData.titleValue),
		};

		Meteor.call('comments.add.revision', token, comment._id, revision, (err) => {
			if (err) {
				console.error('Error adding revision', err);
				this.showSnackBar(err.error);
			} else {
				this.showSnackBar('Revision added');
			}
			self.update(formData);
		});
	},

	update(formData) {
		const { comment } = this.props;

		const keywords = this.getKeywords(formData);
		const authToken = Cookies.get('loginToken');

		let update = [{}];
		if (keywords) {
			update = {
				commenters: Utils.getCommenters(formData.commenterValue),
				keywords,
				referenceWorks: formData.referenceWorks,
			};
		}

		Meteor.call('comment.update', authToken, comment._id, update, (_err) => {
			if (_err) {
				console.error('Error updating comment after adding revision', _err);
				this.showSnackBar(_err.error);
			} else {
				this.showSnackBar('Comment updated');
			}

			this.props.history.push(`/commentary/${comment._id}/edit`);
		});
		// TODO: handle behavior after comment added (add info about success)
	},

	getKeywords(formData) {
		const keywords = [];

		formData.tagsValue.forEach((tag) => {
			const keyword = tag.keyword;
			keyword.isMentionedInLemma = tag.isMentionedInLemma;
			keywords.push(keyword);
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
		if (this.props.comment && this.props.commenters.length) {
			let isOwner = false;
			this.props.commenters.forEach((commenter) => {
				if (!isOwner) {
					isOwner = (~Meteor.user().canEditCommenters.indexOf(commenter._id));
				}
			});
			if (!isOwner) {
				this.props.history.push('/');
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

	showSnackBar(message) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: message,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	},

	render() {
		const filters = this.state.filters;
		const { ready, comment } = this.props;
		Utils.setTitle('Add Revision | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<ApolloProvider
					client={client}
					store={store}
				>
					<div>
						{ready && comment ?
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

											<ContextPanel
												open={this.state.contextReaderOpen}
												workSlug={comment.work.slug}
												subworkN={comment.subwork.n}
												lineFrom={comment.lineFrom}
												selectedLineFrom={comment.lineFrom}
												selectedLineTo={(comment.lineFrom + comment.nLines) - 1}
												editor
												disableEdit
											/>
										</div>
									</div>
								</main>
								<FilterWidget
									filters={filters}
									toggleSearchTerm={this.toggleSearchTerm}
								/>
								<Snackbar
									className="editor-snackbar"
									open={this.state.snackbarOpen}
									message={this.state.snackbarMessage}
									autoHideDuration={4000}
								/>
							</div>
							:
							<div className="ahcip-spinner commentary-loading full-page-spinner">
								<div className="double-bounce1" />
								<div className="double-bounce2" />
							</div>
						}
					</div>
				</ApolloProvider>
			</MuiThemeProvider>
		);
	},
});

const AddRevisionLayoutContainer = createContainer(({ commentId }) => {
	const commentsSub = Meteor.subscribe('comments.id', commentId, Session.get('tenantId'));
	const commentersSub = Meteor.subscribe('commenters', Session.get('tenantId'));
	const keywordsSub = Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });

	const ready = Roles.subscription.ready() && commentsSub.ready() && keywordsSub.ready() && commentersSub.ready();

	const comment = Comments.findOne({_id: commentId});
	const commenters = [];
	if (comment) {
		comment.commenters.forEach((commenter) => {
			commenters.push(Commenters.findOne({
				slug: commenter.slug,
			}));
		});
	}
	const keywords = Keywords.find().fetch();

	return {
		ready,
		comment,
		commenters,
		keywords,
	};
}, AddRevisionLayout);

export default AddRevisionLayoutContainer;
