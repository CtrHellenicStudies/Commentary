import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { compose } from 'react-apollo';
import slugify from 'slugify';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../../lib/muiTheme';

// graphql
import { keywordInsertMutation } from '../../graphql/mutations/keywords';

// components:
import Header from '../../../../components/navigation/Header';
import FilterWidget from '../../../filters/FilterWidget';
import CommentLemmaSelect from '../../../comments/components/CommentLemmaSelect';
import AddKeyword from '../../components/AddKeyword/AddKeyword';
import ContextPanel from '../../../contextPanel/ContextPanel';

// lib
import Utils from '../../../../lib/utils';
import AddKeywordContainer from '../../containers/AddKeywordContainer/AddKeywordContainer';


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
			selectedTextNodes: [],
			filter: {}
		};

		this.getWork = this.getWork.bind(this);
		this.getChapter = this.getChapter.bind(this);
		this.getLineLetter = this.getLineLetter.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.getType = this.getType.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);
		this.addKeyword = this.addKeyword.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.onTypeChange = this.onTypeChange.bind(this);
		this.handlePermissions = this.handlePermissions.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handlePagination = this.handlePagination.bind(this);

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
		this.setState({
			textNodes: Utils.getUrnTextNodesProperties(Utils.createLemmaCitation(work ? work : 'tlg001', 0, 49)).textNodesUrn,
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
	addKeyword(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});
		const that = this;
		// get data for keyword :
		const work = this.getWork();
		const chapter = this.getChapter();
		const lineLetter = this.getLineLetter();
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
	handlePagination(book, chapter) {
		const { filter } = this.state;
		const work = this.getWork();

		filter.edition = book;
		filter.chapter = chapter;
		
		this.setState({
			filter,
		});
		let properties;
		if (work) {
			properties = {
				workUrn: work.urn,
				textNodesUrn: `${work.urn}:${chapter - 1}.1-${chapter}.1`
			}
		} else {
			properties = Utils.getUrnTextNodesProperties(Utils.createLemmaCitation('tlg001', 1, 1, chapter - 1, chapter));
		}
		this.setState({
			textNodesUrn: properties.textNodesUrn
		});
	}
	render() {
		const { filters, textNodes, work, selectedTextNodes, filter } = this.state;
		const { isTest } = this.props;
		let lineFrom;
		let textNodesUrn = this.state.textNodesUrn ? this.state.textNodesUrn : 'urn:cts:greekLit:tlg0013.tlg001:1.1-2.1';

		Utils.setTitle('Add Tag | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<div>
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handlePagination={this.handlePagination}
							filters={filter}
							initialSearchEnabled
							addCommentPage
							selectedWork={this.getWork(filters)}
						/>

						{!isTest ?
							<main>
								<AddKeywordContainer
									textNodesUrn={textNodesUrn}
									work={work} />

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
};

AddKeywordLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};
export default compose(
	keywordInsertMutation
)(AddKeywordLayout);
