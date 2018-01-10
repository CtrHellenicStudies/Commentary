import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import Cookies from 'js-cookie';

import slugify from 'slugify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import qs from 'qs-lite';

// components:
import Header from '../../../components/header/Header';
import FilterWidget from '../../filters/FilterWidget';
import Spinner from '../../../components/loading/Spinner';
import CommentLemmaSelect from './commentLemma/CommentLemmaSelect';
import AddComment from './AddComment';
import ContextPanel from '../../contextPanel/ContextPanel';

// lib
import muiTheme from '../../../lib/muiTheme';
import Utils from '../../../lib/utils';

// graphql
import { textNodesQuery } from '../../../graphql/methods/textNodes';
import { commentsInsertMutation } from '../../../graphql/methods/comments';


const getKeywords = (formData) => {
	
	const keywords = [];

	formData.tagsValue.forEach((tag) => {
		const keywordCopy = {};
		for (const [key, value] of Object.entries(tag.keyword)) {
			if (key === 'isMetionedInLemma') {
				keywordCopy[key] = tag.isMentionedInLemma;
			} else if (key !== '__typename') {
				keywordCopy[key] = value;
			}
		}
		keywords.push(keywordCopy);
	});
	return keywords;
};

const getFilterValues = (filters) => {
	const filterValues = {};

	filters.forEach((filter) => {
		if (filter.key === 'works') {
			filterValues.work = filter.values[0];
		} else if (filter.key === 'subworks') {
			filterValues.subwork = filter.values[0];
		} else if (filter.key === 'lineTo') {
			filterValues.lineTo = filter.values[0];
		} else if (filter.key === 'lineFrom') {
			filterValues.lineFrom = filter.values[0];
		}
	});

	return filterValues;
};


/*
 *	BEGIN AddCommentLayout
 */
class AddCommentLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: ''
		};

		// methods:
		this.updateSelectedLines = this.updateSelectedLines.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);

		this.addComment = this.addComment.bind(this);
		this.getWork = this.getWork.bind(this);
		this.getSubwork = this.getSubwork.bind(this);
		this.getLineLetter = this.getLineLetter.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.closeContextReader = this.closeContextReader.bind(this);
		this.openContextReader = this.openContextReader.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);
		this.updateQuery = this.updateQuery.bind(this);
		this.getChildrenContext = this.getChildrenContext.bind(this);
	}

	componentWillUpdate() {
		if (!Utils.userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}
	updateQuery() {
		this.setState({
			shouldUpdateQuery: false
		});
	}
	// --- BEGNI LINE SELECTION --- //

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
			selectedLineFrom = this.state.selectedLineFrom;
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
			selectedLineTo = this.state.selectedLineTo;
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		} else {
			return;
		}
		const { filters } = this.state;
		const { work, subwork } = getFilterValues(filters);
		const properties = {
			workSlug: work ? work.slug : 'iliad',
			subworkN: subwork ? subwork.n : 1,
			lineFrom: selectedLineFrom,
			lineTo: selectedLineTo
		};
		this.props.textNodesQuery.refetch(properties);
	}

	toggleSearchTerm(key, value) {
		const { filters } = this.state;

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
	}

	// --- END LINE SELECTION --- //


	// --- BEGNI ADD COMMENT --- //

	addComment(formData, possibleCommenters, textValue, textRawValue) {
		this.setState({
			loading: true,
		});

		// get data for comment:
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const referenceWorks = formData.referenceWorks;
		const commenters = Utils.getCommenters(formData.commenterValue, possibleCommenters);
		const selectedLineTo = this.getSelectedLineTo();

		// get keywords after they were created:
		const keywords = getKeywords(formData);
		const revisionId = Date.now();

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
			commenters: commenters.map(function(commenter) {
				const _commenter = JSON.parse(JSON.stringify(commenter));
				delete _commenter._id;
				delete _commenter.__typename;
				delete _commenter.avatar;
				delete _commenter.textRaw;
				return _commenter;
			}),
			keywords: keywords || [{}],
			referenceWorks: referenceWorks,
			tenantId: sessionStorage.getItem('tenantId'),
			// created: JSON.stringify(new Date()), TODO
			status: 'publish',
		};
		this.props.commentInsert(comment).then((res) => {
			if (res.data.commentInsert._id) {
				this.setState({
					loading: false
				});
				const urlParams = qs.stringify({_id: res.data.commentInsert._id});
				
				this.props.history.push(`/commentary?${urlParams}`);
				
			}
		});
	}

	getWork() {
		let work = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
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
	}

	getSubwork() {
		let subwork = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'subworks') {
				subwork = filter.values[0];
			}
		});
		if (!subwork) {
			subwork = {
				title: '1',
				n: 1,
			};
		}
		return subwork;
	}

	getLineLetter() {

		const { selectedLineTo, selectedLineFrom } = this.state;

		let lineLetter = '';
		if (selectedLineTo === 0 && selectedLineFrom > 0) {
			lineLetter = this.commentLemmaSelect.state ? this.commentLemmaSelect.state.lineLetterValue : null;
		}
		return lineLetter;
	}

	getSelectedLineTo() {

		const { selectedLineTo, selectedLineFrom } = this.state;

		let newSelectedLineTo = 0;
		if (selectedLineTo === 0) {
			newSelectedLineTo = selectedLineFrom;
		} else {
			newSelectedLineTo = selectedLineTo;
		}
		return newSelectedLineTo;
	}

	// --- END ADD COMMENT --- //

	closeContextReader() {
		this.setState({
			contextReaderOpen: false,
		});
	}

	openContextReader() {
		this.setState({
			contextReaderOpen: true,
		});
	}

	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
		});
	}

	handleChangeLineN(e) {
		const { filters } = this.state;

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
	}
	getChildrenContext() {
		return getMuiTheme(muiTheme);
	}
	render() {

		const { filters, loading, selectedLineFrom, selectedLineTo, contextReaderOpen } = this.state;
		const { work, subwork, lineFrom } = getFilterValues(filters);

		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={this.getChildrenContext()}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							selectedWork={this.getWork(filters)}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>
						<main>
							<div className="commentary-comments">
								<div className="comment-group">
									<CommentLemmaSelect
										ref={(component) => { this.commentLemmaSelect = component; }}
										lineFrom={selectedLineFrom}
										lineTo={selectedLineTo}
										workSlug={work ? work.slug : 'iliad'}
										subworkN={subwork ? subwork.n : 1}
										shouldUpdateQuery={this.state.updateQuery}
										updateQuery={this.updateQuery}
										textNodes={this.props.textNodesQuery.loading ? [] : this.props.textNodesQuery.textNodes}
									/>

									<AddComment
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
										submitForm={this.addComment}
										work={work}
									/>

									<ContextPanel
										open={contextReaderOpen}
										workSlug={work ? work.slug : 'iliad'}
										subworkN={subwork ? subwork.n : 1}
										lineFrom={lineFrom || 1}
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
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
					</div>
					:
					<Spinner fullPage />
				}
			</MuiThemeProvider>
		);
	}
}
AddCommentLayout.propTypes = {
	commentInsert: PropTypes.func,
	history: PropTypes.object,
	textNodesQuery: PropTypes.object
};

export default compose(
	commentsInsertMutation,
	textNodesQuery
)(AddCommentLayout);
