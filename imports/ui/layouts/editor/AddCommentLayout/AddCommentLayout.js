import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import cookie from 'react-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components:
import Header from '/imports/ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';
import Spinner from '/imports/ui/components/loading/Spinner';
import CommentLemmaSelect from '/imports/ui/components/editor/addComment/CommentLemmaSelect';
import AddComment from '/imports/ui/components/editor/addComment/AddComment';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';

// lib
import muiTheme from '/imports/lib/muiTheme';

// api
import Commenters from '/imports/api/collections/commenters';


const AddCommentLayout = React.createClass({

	propTypes: {
		ready: React.PropTypes.bool,
		isTest: React.PropTypes.bool,
	},

	getInitialState() {
		return {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
		};
	},

	componentWillUpdate() {
		this.handlePermissions();
	},

	handlePermissions() {
		if (Roles.subscription.ready()) {
			if (!Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter'])) {
				FlowRouter.go('/');
			}
		}
	},

	// --- BEGNI LINE SELECTION --- //

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
		} else if (selectedLineTo != null && selectedLineTo != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		} else {
			// do nothing
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
					filters[i].values.push(value);
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

	// --- END LINE SELECTION --- //

	// --- BEGNI ADD COMMENT --- //

	addComment(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});

		// get data for comment:
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const referenceWorks = formData.referenceWorks;
		const commenter = this.getCommenter(formData);
		const selectedLineTo = this.getSelectedLineTo();
		const token = cookie.load('loginToken');

		// need to add new keywords first, so keyword id can be added to comment:
		this.addNewKeywordsAndIdeas(formData.keywordsValue, formData.keyideasValue, () => {

			// get keywords after they were created:
			const keywords = this.getKeywords(formData);
			const revisionId = new Meteor.Collection.ObjectID();

			// create comment object to be inserted:
			const comment = {
				work: {
					title: work.title,
					slug: work.slug,
					order: work.order,
				},
				subwork: {
					title: subwork.title,
					n: subwork.n,
				},
				lineFrom: this.state.selectedLineFrom,
				lineTo: selectedLineTo,
				lineLetter,
				nLines: (selectedLineTo - this.state.selectedLineFrom) + 1,
				revisions: [{
					_id: revisionId.valueOf(),
					title: formData.titleValue,
					text: textValue,
					textRaw: textRawValue,
					created: referenceWorks ? referenceWorks.date : new Date(),
					slug: slugify(formData.titleValue),
				}],
				commenters: commenter ? [{
					_id: commenter._id,
					name: commenter.name,
					slug: commenter.slug,
				}] : [{}],
				keywords: keywords || [{}],
				referenceWorks: referenceWorks,
				tenantId: Session.get('tenantId'),
				created: new Date(),
			};

			Meteor.call('comments.insert', token, comment, (error, commentId) => {
				FlowRouter.go('/commentary', {}, {_id: commentId});
			});
		});
	},

	matchKeywords(keywords) {
		const matchedKeywords = [];
		if (keywords) {
			keywords.forEach((keyword) => {
				const foundKeyword = Keywords.findOne({
					title: keyword.label,
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
			const newKeywordArray = [];
			keywords.forEach((keyword) => {
				const foundKeyword = Keywords.findOne({title: keyword.label});
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
				const token = cookie.load('loginToken');
				return Meteor.call('keywords.insert', token, newKeywordArray, (err) => {
					if (err) {
						console.log(err);
						return null;
					}
					return next();
				});
			}
			return next();
		}
		return next();
	},

	getWork() {
		let work = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'work') {
				work = values[0];
			}
		});
		if (!work) {
			work = {
				title: 'Iliad',
				slug: 'iliad',
				order: 1,
			};
		}
		return work;
	},

	getSubwork() {
		let subwork = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'subwork') {
				subwork = values[0];
			}
		});
		if (!subwork) {
			subwork = {
				title: '1',
				n: 1,
			};
		}
		return subwork;
	},

	getLineLetter() {
		let lineLetter = '';
		if (this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) {
			lineLetter = this.commentLemmaSelect.state ? his.commentLemmaSelect.state.lineLetterValue : null;
		}
		return lineLetter;
	},

	getReferenceWorks(formData) {
		let referenceWorks = null;
		if (formData.referenceWorksValue) {
			referenceWorks = ReferenceWorks.findOne({_id: formData.referenceWorksValue.value});
		}
		return referenceWorks;
	},

	getCommenter(formData) {
		const commenter = Commenters.findOne({
			_id: formData.commenterValue.value,
		});
		return commenter;
	},

	getSelectedLineTo() {
		let selectedLineTo = 0;
		if (this.state.selectedLineTo === 0) {
			selectedLineTo = this.state.selectedLineFrom;
		} else {
			selectedLineTo = this.state.selectedLineTo;
		}
		return selectedLineTo;
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

	// --- END ADD COMMENT --- //

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

	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
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
		const { isTest } = this.props;
		const { filters } = this.state;
		let work;
		let subwork;
		let lineFrom;
		let lineTo;

		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			} else if (filter.key === 'subworks') {
				subwork = filter.values[0];
			} else if (filter.key === 'lineTo') {
				lineTo = filter.values[0];
			} else if (filter.key === 'lineFrom') {
				lineFrom = filter.values[0];
			}
		});

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				{!this.state.loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<div>
							<Header
								toggleSearchTerm={this.toggleSearchTerm}
								handleChangeLineN={this.handleChangeLineN}
								filters={this.state.filters}
								initialSearchEnabled
								addCommentPage
							/>

							{!isTest ?
								<main>
									<div className="commentary-comments">
										<div className="comment-group">
											<CommentLemmaSelect
												ref={(component) => { this.commentLemmaSelect = component; }}
												selectedLineFrom={this.state.selectedLineFrom}
												selectedLineTo={this.state.selectedLineTo}
												workSlug={work ? work.slug : 'iliad'}
												subworkN={subwork ? subwork.n : 1}
											/>

											<AddComment
												selectedLineFrom={this.state.selectedLineFrom}
												submitForm={this.addComment}
											/>

											<ContextPanel
												open={this.state.contextReaderOpen}
												workSlug={work ? work.slug : 'iliad'}
												subworkN={subwork ? subwork.n : 1}
												lineFrom={lineFrom || 1}
												selectedLineFrom={this.state.selectedLineFrom}
												selectedLineTo={this.state.selectedLineTo}
												updateSelectedLines={this.updateSelectedLines}
												editor
											/>
										</div>
									</div>

									<FilterWidget
										filters={filters}
										toggleSearchTerm={this.toggleSearchTerm}
									/>
								</main>
							: ''}
						</div>
					</div>
					:
					<Spinner fullPage />
				}
			</MuiThemeProvider>
		);
	},
});


const AddCommentLayoutContainer = (() => {
	const ready = Roles.subscription.ready();
	return {
		ready,
	};
}, AddCommentLayout);

export default AddCommentLayoutContainer;
