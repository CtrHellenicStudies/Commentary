import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { compose } from 'react-apollo';


// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import keywordsQuery from '../../../keywords/graphql/queries/keywordsQuery';
import { editionsQuery } from '../../../../graphql/methods/editions';

// components:
import SearchToolDropdown from '../SearchToolDropdown';
import KeywordsDropdown from '../KeywordsDropdown';
import KeyideasDropdown from '../KeyideasDropdown';
import CommentatorsDropdown from '../CommentatorsDropdown';
import ReferenceDropdown from '../ReferenceDropdown';
import WorksDropdown from '../WorksDropdown';
import BookAndChapterPages from '../BookAndChapterPages';

// lib
import Utils from '../../../../lib/utils';


const getWorkInFilter = (filters) => {
	let workInFilter = false;
	filters.forEach((filter) => {
		if (filter.key === 'works') {
			workInFilter = true;
		}
	});
	return workInFilter;
};


/*
	BEGIN CommentarySearchToolbar
*/
class CommentarySearchToolbar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			searchDropdownOpen: '',
			moreDropdownOpen: false,
			activeWorkNew: null,
			subworksTitle: 'Book',
			referenceWorks: [],
			works: [],
			keywords: [],
			keyideas: [],
			lineFrom: 0,
			lineTo: 909
		};

		// methods:
		if (props.handleChangeTextsearch) this.handleChangeTextsearch = _.debounce(props.handleChangeTextsearch, 300);
		this.toggleSearchDropdown = this.toggleSearchDropdown.bind(this);
		this.toggleMoreDropdown = this.toggleMoreDropdown.bind(this);
		this.switchToHymns = this.switchToHymns.bind(this);
		this.switchToBooks = this.switchToBooks.bind(this);
		const tenantId = sessionStorage.getItem('tenantId');
		if (!this.props.addCommentPage) {
			this.props.keywordsQuery.refetch({
				tenantId: tenantId
			});
		}
	}
	toggleSearchDropdown(targetDropdown) {
		if (this.state.searchDropdownOpen === targetDropdown) {
			this.setState({
				searchDropdownOpen: '',
			});
		} else {
			this.setState({
				searchDropdownOpen: targetDropdown,
			});
		}
	}
	toggleMoreDropdown() {
		this.setState({
			moreDropdownOpen: !this.state.moreDropdownOpen,
		});
	}
	switchToHymns() {
		this.setState({
			selectedWork: 'Hymn',
		});
	}
	switchToBooks() {
		this.setState({
			selectedWork: 'Book',
		});
	}
	componentWillReceiveProps(nextProps) {
		let workFilter;
		if (nextProps.keywordsQuery.loading ||
			nextProps.commentersQuery.loading ||
			nextProps.editionsQuery.loading ||
			nextProps.editionsQuery.loading) {
			return;
		}
		if (
			this.props.filters
			&& nextProps.filters
			&& nextProps.filters.length
		) {
			nextProps.filters.forEach((filter) => {
				if (filter.key === 'works') {
					workFilter = filter;
				}
			});

			if (workFilter && workFilter.values.length) {
				this.setState({
					subworksTitle: workFilter.values[0].slug === 'homeric-hymns' ? 'Hymn' : 'Book'
				});
			}
		}

		if (this.props.selectedWork) {
			this.setState({
				subworksTitle: nextProps.selectedWork.slug === 'homeric-hymns' ? 'Hymn' : 'Book'
			});
		}
		this.setState({
			works: Utils.worksFromEditions(nextProps.editionsQuery.works),
		});
		if (!nextProps.addCommentPage) {
			this.setState({
				keyideas: nextProps.keywordsQuery.keywords.filter(x => x.type === 'idea'),
				keywords: nextProps.keywordsQuery.keywords.filter(x => x.type === 'word'),
				commenters: nextProps.commentersQuery.commenters,
				referenceWorks: nextProps.referenceWorksQuery.referenceWorks,
			});
		}
	}


	render() {

		const { toggleSearchTerm, filters, addCommentPage, handlePagination } = this.props;
		const { keywords, keyideas, commenters, referenceWorks, works } = this.state;
		const { searchDropdownOpen, moreDropdownOpen } = this.state;

		const workInFilter = getWorkInFilter(filters);

		return (
			<span>
				{/* {!addCommentPage ?
					<div className="search-tool text-search text-search--header">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={this.handleChangeTextsearch}
						/>
					</div>
				: '' } */}

				{!addCommentPage &&
					<KeywordsDropdown
						keywords={keywords}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
						filters={filters}
					/>}

				{!addCommentPage &&
					<KeyideasDropdown
						keyideas={keyideas}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
						filters={filters}
					/>}

				{!addCommentPage &&
					<CommentatorsDropdown
						commenters={commenters}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
						filters={filters}
					/>}

				{!addCommentPage &&
					<ReferenceDropdown
						reference={referenceWorks}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
						filters={filters}
					/>}
				<WorksDropdown
					works={works}
					searchDropdownOpen={searchDropdownOpen}
					toggleSearchDropdown={this.toggleSearchDropdown}
					toggleSearchTerm={toggleSearchTerm}
					filters={filters}
				/>

				<div
					style={{padding: '10px 20px' }}
					className={`line-search ${(workInFilter === false) ? 'disabled' : ''}`}
				>
					<BookAndChapterPages
						updateTextInformations={handlePagination}
					/>
					<div className="disabled-screen" />
				</div>

				{!addCommentPage &&
					<SearchToolDropdown
						name="more"
						open={moreDropdownOpen}
						toggle={this.toggleMoreDropdown}
						disabled={false}
					>
						{/* <div className="search-tool text-search">
							<TextField
								hintText=""
								floatingLabelText="Search"
								onChange={this.handleChangeTextsearch}
							/>
						</div> */}

						<KeywordsDropdown
							keywords={keywords}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<KeyideasDropdown
							keyideas={keyideas}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<CommentatorsDropdown
							commenters={commenters}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

						<ReferenceDropdown
							reference={referenceWorks}
							searchDropdownOpen={searchDropdownOpen}
							toggleSearchDropdown={this.toggleSearchDropdown}
							toggleSearchTerm={toggleSearchTerm}
							filters={filters}
						/>

					</SearchToolDropdown>}

			</span>
		);
	}
}
/*
	END CommentarySearchToolbar
*/
CommentarySearchToolbar.propTypes = {
	filters: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
	toggleSearchTerm: PropTypes.func.isRequired,
	handleChangeTextsearch: PropTypes.func,
	handlePagination: PropTypes.func.isRequired,
	addCommentPage: PropTypes.bool.isRequired,
	isTest: PropTypes.bool,
	selectedWork: PropTypes.object,
	editionsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	commentersQuery: PropTypes.object,
	keywordsQuery: PropTypes.object
};
CommentarySearchToolbar.defaultProps = {
	keywords: [],
	keyideas: [],
	commenters: [],
	referenceWorks: [],
	works: [],
	handleChangeTextsearch: null,
}
export default compose(
	commentersQuery,
	referenceWorksQuery,
	keywordsQuery,
	editionsQuery
)(CommentarySearchToolbar);
