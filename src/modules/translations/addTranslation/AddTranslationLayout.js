import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../lib/muiTheme';

import { compose } from 'react-apollo';

// graphql
import { textNodesQuery } from '../../../graphql/methods/textNodes';

// components:
import Header from '../../../components/header/Header';
import FilterWidget from '../../filters/FilterWidget';
import Spinner from '../../../components/loading/Spinner';
import CommentLemmaSelect from '../../comments/addComment/commentLemma/CommentLemmaSelect';
import AddTranslation from './AddTranslation';
import ContextPanel from '../../contextPanel/ContextPanel';

// lib
import Utils from '../../../lib/utils';


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


class AddTranslationLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			work: '',
			subwork1: '',
			subwork2: '',
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: '',
		};

		// methods:
		this.updateSelectedLines = this.updateSelectedLines.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);

		this.getWork = this.getWork.bind(this);
		this.getSubwork = this.getSubwork.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.closeContextReader = this.closeContextReader.bind(this);
		this.openContextReader = this.openContextReader.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);
		this.toggleInputLines = this.toggleInputLines.bind(this);
		this.getText = this.getText.bind(this);
	}

	toggleInputLines() {
		this.setState({
			toggleInputLinesIsToggled: !this.state.toggleInputLinesIsToggled,
		});
	}

	getText(textValue) {
		const text = [];
		textValue.blocks.forEach((textObject) => {
			text.push({
				line: textValue.blocks.findIndex(textObject),
				text: textObject.text
			});
		});
	}

	// line selection
	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
			selectedLineTo = this.state.selectedLineTo;
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
			selectedLineFrom = this.state.selectedLineFrom;
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
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
		const {filters} = this.state;

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

	// get work/subwork/line letter/selected line to
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
		if (!this.state.toggleInputLinesIsToggled) {
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

		return {
			title: 'test',
			n: 1,
		};
	}

	getSelectedLineTo() {
		const {selectedLineTo, selectedLineFrom} = this.state;

		let newSelectedLineTo = 0;
		if (selectedLineTo === 0) {
			newSelectedLineTo = selectedLineFrom;
		} else {
			newSelectedLineTo = selectedLineTo;
		}
		return newSelectedLineTo;
	}

	// context reader/line change
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
		const {filters} = this.state;

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
		const {
			filters, loading, selectedLineFrom, selectedLineTo, contextReaderOpen,
			toggleInputLinesIsToggled
		} = this.state;
		const { work, subwork, lineFrom } = getFilterValues(filters);
		Utils.setTitle('Add Tag | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
							selectedWork={this.getWork(filters)}
						/>

						<main>
							<div className="commentary-comments">
								<div className="comment-group">
									{!toggleInputLinesIsToggled ?
										<CommentLemmaSelect
											ref={(component) => {
												this.commentLemmaSelect = component;
											}}
											selectedLineFrom={selectedLineFrom}
											selectedLineTo={selectedLineTo}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
											shouldUpdateQuery={this.state.updateQuery}
											updateQuery={this.updateQuery}
											textNodes={this.props.textNodesQuery.loading ? [] : this.props.textNodesQuery.textNodesAhcip}
										/> : ''}

									<AddTranslation
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
										toggleInputLines={this.toggleInputLines}
										toggleInputLinesIsToggled={toggleInputLinesIsToggled}
										toggleInputLinesLabel={toggleInputLinesIsToggled ? 'Select Lines' : 'Input Lines'}
									/>
									{!toggleInputLinesIsToggled ?
										<ContextPanel
											open={contextReaderOpen}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
											lineFrom={lineFrom || 1}
											selectedLineFrom={selectedLineFrom}
											selectedLineTo={selectedLineTo}
											updateSelectedLines={this.updateSelectedLines}
											editor
										/> : ''}
								</div>
							</div>
							{!toggleInputLinesIsToggled ?
								<FilterWidget
									filters={filters}
									toggleSearchTerm={this.toggleSearchTerm}
								/> : ''}
						</main>
					</div>
					:
					<Spinner fullPage />
				}
			</MuiThemeProvider>
		);
	}
}
AddTranslationLayout.propTypes = {
	ready: PropTypes.bool,
	history: PropTypes.array,
	textNodesQuery: PropTypes.object
};
AddTranslationLayout.defaultProps = {
	ready: false,
};

export default compose(textNodesQuery)(AddTranslationLayout);
