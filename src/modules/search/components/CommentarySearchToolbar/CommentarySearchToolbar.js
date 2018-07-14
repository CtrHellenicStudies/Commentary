import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import keywordsQuery from '../../../keywords/graphql/queries/list';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// components:
import SearchToolDropdown from '../SearchToolDropdown';
import KeywordsDropdown from '../KeywordsDropdown';
import KeyideasDropdown from '../KeyideasDropdown';
import CommentatorsDropdown from '../CommentatorsDropdown';
import ReferenceDropdown from '../ReferenceDropdown';
import WorksDropdown from '../WorksDropdown';
import LocationBrowserContainer from '../../containers/LocationBrowserContainer';

// lib
import Utils from '../../../../lib/utils';

import './CommentarySearchToolbar.css';


/*
	BEGIN CommentarySearchToolbar
*/
class CommentarySearchToolbar extends React.Component {

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

		const { tenantId } = this.props;
		if (!this.props.addCommentPage) {
			this.props.keywordsQuery.refetch({
				tenantId: tenantId
			});
		}

		autoBind(this);
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
		const { toggleSearchTerm, filters, addCommentPage } = this.props;
		const {
			keywords, keyideas, commenters, referenceWorks, works, searchDropdownOpen,
			moreDropdownOpen,
		} = this.state;

		return (
			<div>
				{!addCommentPage ?
					<div className="search-tool text-search text-search--header">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={this.handleChangeTextsearch}
						/>
					</div>
					: '' }

				<WorksDropdown
					works={works}
					searchDropdownOpen={searchDropdownOpen}
					toggleSearchDropdown={this.toggleSearchDropdown}
					toggleSearchTerm={toggleSearchTerm}
					filters={filters}
				/>

				<LocationBrowserContainer
					urn={"urn:cts:greekLit:tlg0012.tlg001"}
				/>

				{!addCommentPage &&
					<SearchToolDropdown
						name="more"
						open={moreDropdownOpen}
						toggle={this.toggleMoreDropdown}
						disabled={false}
					>
						<div className="search-tool text-search">
							<TextField
								hintText=""
								floatingLabelText="Search"
								onChange={this.handleChangeTextsearch}
							/>
						</div>
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

					</SearchToolDropdown>
				}
			</div>
		);
	}
}
/*
	END CommentarySearchToolbar
*/

CommentarySearchToolbar.propTypes = {
	filters: PropTypes.any, // eslint-disable-line react/forbid-prop-types
	toggleSearchTerm: PropTypes.func,
	handleChangeTextsearch: PropTypes.func,
	handlePagination: PropTypes.func,
	addCommentPage: PropTypes.bool,
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
	filters: [],
	handleChangeTextsearch: null,
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
	referenceWorksQuery,
	keywordsQuery,
	editionsQuery
)(CommentarySearchToolbar);
