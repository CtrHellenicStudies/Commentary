import React, { Component } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Utils from '../../../../lib/utils';
import Header from '../../../../components/navigation/Header/Header';

// components
import FilterWidget from '../../../filters/components/FilterWidget/FilterWidget';
import ContextPanel from '../../../contextPanel/components/ContextPanel/ContextPanel';
import AddComment from '../../components/AddComment/AddComment';
import CommentLemmaSelectContainer from '../CommentLemmaSelectContainer';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';

// lib
import getSelectedLemmaUrn from '../../lib/getSelectedLemmaUrn';



const getFilterValues = (filters) => {
	const filterValues = {};

	filters.forEach((filter) => {
		if (filter.key === 'works') {
			filterValues.work = filter.values[0];
		} else if (filter.key === 'lineTo') {
			filterValues.lineTo = filter.values[0];
		} else if (filter.key === 'lineFrom') {
			filterValues.lineFrom = filter.values[0];
		}
	});

	return filterValues;
};


class AddCommentContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLemmaCitation: null,
			filters: [],
		};

		autoBind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			textNodes: props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes
		});
	}

	updateSelectedLemma(selectedLemmaCitation) {
		this.setState({ selectedLemmaCitation });
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
				slug: '001',
				order: 1,
			};
		}
		return work;
	}

	handlePagination(book, chapter) {
		const { filters } = this.state;
		const work = this.getWork();

		filters.edition = book;
		filters.chapter = chapter;

		this.setState({
			filters,
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
		this.props.updatetextNodesUrn(properties.textNodesUrn);
	}

	render() {

		const {
			selectedLemmaCitation, selectedTextNodes, filters, contextReaderOpen,
			textNodes,
		} = this.state;
		const { textNodesUrn, submitForm } = this.props;
		const { work } = getFilterValues(filters);


		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<div>
				<Header
					toggleSearchTerm={this.toggleSearchTerm}
					handlePagination={this.handlePagination}
					workFilters={this.state.filters}
					initialSearchEnabled
					addCommentPage
				/>
				<main>
					<div className="commentary-comments">
						<div className="comment-group">
							{(selectedLemmaCitation && 'passageFrom' in selectedLemmaCitation) ?
								<CommentLemmaSelectContainer
									selectedLemmaCitation={selectedLemmaCitation}
									textNodesUrn={getSelectedLemmaUrn(selectedLemmaCitation)}
							  />
								: ''}

							<AddComment
								selectedLemmaCitation={selectedLemmaCitation}
								submitForm={submitForm}
								work={work}
						  />
						</div>

						<ContextPanel
							open={contextReaderOpen}
							filters={filters}
							selectedLemmaCitation={selectedLemmaCitation}
							updateSelectedLemma={this.updateSelectedLemma}
							textNodes={textNodes}
							textNodesUrn={textNodesUrn}
							editor
					  />
					</div>

					<FilterWidget
						filters={filters}
						toggleSearchTerm={this.toggleSearchTerm}
				  />
				</main>
			</div>
		);
	}
}

AddCommentContainer.props = {
	selectedTextNodes: PropTypes.object,
	textNodesQuery: PropTypes.func
};

export default compose(textNodesQuery)(AddCommentContainer);
