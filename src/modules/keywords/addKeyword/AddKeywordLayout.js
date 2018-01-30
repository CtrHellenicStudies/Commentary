import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { compose } from 'react-apollo';
import slugify from 'slugify';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../lib/muiTheme';

// graphql
import { keywordInsertMutation } from '../../../graphql/methods/keywords';
import { textNodesQuery } from '../../../graphql/methods/textNodes';

// components:
import Header from '../../../components/header/Header';
import FilterWidget from '../../filters/FilterWidget';
import CommentLemmaSelect from '../../comments/addComment/commentLemma/CommentLemmaSelect';
import AddKeyword from './AddKeyword';
import ContextPanel from '../../contextPanel/ContextPanel';

// lib
import Utils from '../../../lib/utils';


class AddKeywordLayout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			selectedType: 'word',
			contextReaderOpen: true,
			loading: false,
			selectedTextNodes: []
		};

		this.getWork = this.getWork.bind(this);
		this.getChapter = this.getChapter.bind(this);
		this.getLineLetter = this.getLineLetter.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.getType = this.getType.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);
		this.updateSelectedLines = this.updateSelectedLines.bind(this);
		this.addKeyword = this.addKeyword.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.onTypeChange = this.onTypeChange.bind(this);
		this.handlePermissions = this.handlePermissions.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);

	}

	componentWillUpdate() {
		this.handlePermissions();
	}
	componentWillReceiveProps(props) {
		const { filters } = this.state;
		let work = 'tlg001';
		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			}
		});
		if (props.textNodesQuery.loading) {
			return;
		}
		if (!props.textNodesQuery.variables.workUrn) {
			props.textNodesQuery.refetch(Utils.getUrnTextNodesProperties(Utils.createLemmaCitation(work ? work : 'tlg001', 0, 49)));
			return;
		}
		this.setState({
			textNodes: props.textNodesQuery.collections[0].textGroups[0].works,
			work: work
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
				slug: 'tlg001',
				order: 1,
			};
		}
		console.log(work);
		return work;
	}
	getChapter() {
		let chapter = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'chapters') {
				chapter = filter.values[0];
			}
		});
		if (!chapter) {
			chapter = {
				n: 1,
			};
		}
		return chapter;
	}
	getLineLetter() {
		let lineLetter = '';
		if (this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) {
			lineLetter = this.state.lineLetterValue;
		}
		return lineLetter;
	}
	getSelectedLineTo() {
		let selectedLineTo = 0;
		if (this.state.selectedLineTo === 0) {
			selectedLineTo = this.state.selectedLineFrom;
		} else {
			selectedLineTo = this.state.selectedLineTo;
		}
		return selectedLineTo;
	}
	getType() {
		return this.state.selectedType;
	}
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
	}
	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		const { filters, textNodes } = this.state;
		let work;
		let finalFrom = 0, finalTo = 0;
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
			finalFrom = 0;
			finalTo = selectedLineTo;
		} else if (selectedLineTo === null || selectedLineFrom > selectedLineTo) {
			this.setState({
				selectedLineFrom: selectedLineFrom - 1,
				selectedLineTo: selectedLineFrom
			});
			finalFrom = selectedLineFrom - 1;
			finalTo = selectedLineFrom;
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
			finalFrom = selectedLineFrom;
			finalTo = selectedLineTo;
		} else {
			return;
		}
		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			}
		});
		this.setState({
			selectedTextNodes: Utils.filterTextNodesBySelectedLines(textNodes, finalFrom, finalTo)
		});
	}
	addKeyword(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});
		const that = this;
		// get data for keyword :
		const work = this.getWork();
		const chapter = this.getChapter();
		const lineLetter = this.getLineLetter();
		const selectedLineTo = this.getSelectedLineTo();
		console.log(this.state.selectedLineFrom, this.state.selectedLineTo);
		// create keyword object to be inserted:
		const keyword = {
			work: {
				title: work.title,
				slug: work.slug,
				order: work.order,
			},
			subwork: {
				n: chapter.n,
			},
			lineFrom: this.state.selectedLineFrom,
			lineTo: this.state.selectedLineTo,
			lineLetter,
			title: formData.titleValue,
			slug: slugify(formData.titleValue.toLowerCase()),
			description: textValue,
			descriptionRaw: JSON.stringify(textRawValue),
			type: this.state.selectedType,
			count: 1,
			tenantId: sessionStorage.getItem('tenantId'),
		};
		this.props.keywordInsert(keyword).then(function() {
			that.props.history.push(`/tags/${keyword.slug}`);
		}
		);
	}
	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		this.timeout = setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	}
	onTypeChange(type) {
		this.setState({
			selectedType: type,
		});
	}
	handlePermissions() {
		if (!Utils.userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}
	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
		});
	}
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
	}
	render() {
		const { filters, textNodes, work, selectedTextNodes } = this.state;
		const { isTest } = this.props;
		let lineFrom;

		Utils.setTitle('Add Tag | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<div>
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
							selectedWork={this.getWork(filters)}
						/>

						{!isTest ?
							<main>

								<div className="commentary-comments">
									<div className="comment-group">
										<CommentLemmaSelect
											ref={(component) => { this.commentLemmaSelect = component; }}
											lineFrom={this.state.selectedLineFrom}
											lineTo={this.state.selectedLineTo}
											workSlug={work}
											shouldUpdateQuery={this.state.updateQuery}
											updateQuery={this.updateQuery}
											textNodes={selectedTextNodes}				
										/>
										<AddKeyword
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											submitForm={this.addKeyword}
											onTypeChange={this.onTypeChange}
										/>
										<ContextPanel
											open={this.state.contextReaderOpen}
											workSlug={work ? work : 'tlg001'}
											lineFrom={lineFrom || 1}
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											updateSelectedLines={this.updateSelectedLines}
											textNodes={textNodes}
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
			</MuiThemeProvider>
		);
	}
}
AddKeywordLayout.propTypes = {
	isTest: PropTypes.bool,
	history: PropTypes.object,
	keywordInsert: PropTypes.func,
	textNodesQuery: PropTypes.object
};

AddKeywordLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};
export default compose(
	keywordInsertMutation,
	textNodesQuery
)(AddKeywordLayout);
