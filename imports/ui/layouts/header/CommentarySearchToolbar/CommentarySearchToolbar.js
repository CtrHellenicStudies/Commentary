import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';

// models:
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';
import Works from '/imports/models/works';

// components:
import { KeywordsDropdown, KeyideasDropdown, CommentatorsDropdown, ReferenceDropdown, WorksDropdown, SubworksDropdown, ChaptersDropdown } from '/imports/ui/components/header/SearchDropdowns';
import LineRangeSlider from '/imports/ui/components/header/LineRangeSlider';
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown';


/*
	helpers
*/
const getLineFrom = (filters) => {

	const filterLineFrom = filters.find(filter => filter.key === 'lineFrom');

	let lineFrom = null;
	if (filterLineFrom) {
		lineFrom = filterLineFrom.values[0];
	}

	return lineFrom;
};

const getLineTo = (filters) => {

	const filterLineTo = filters.find(filter => filter.key === 'lineTo');

	let lineTo = null;
	if (filterLineTo) {
		lineTo = filterLineTo.values[0];
	}

	return lineTo;
};

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
class CommentarySearchToolbar extends React.Component {

	static propTypes = {
		filters: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
		toggleSearchTerm: PropTypes.func.isRequired,
		handleChangeTextsearch: PropTypes.func,
		handleChangeLineN: PropTypes.func.isRequired,
		addCommentPage: PropTypes.bool.isRequired,
		isTest: PropTypes.bool,
		selectedWork: PropTypes.object,

		// from createContainer:
		keywords: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
		})),
		keyideas: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
		})),
		commenters: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
		})),
		referenceWorks: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
		})),
		works: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			subworks: PropTypes.arrayOf(PropTypes.shape({
				n: PropTypes.number.isRequired,
				title: PropTypes.string.isRequired,
			})),
		})),
	};

	static defaultProps = {
		keywords: [],
		keyideas: [],
		commenters: [],
		referenceWorks: [],
		works: [],
		handleChangeTextsearch: null,
	}

	constructor(props) {
		super(props);

		this.state = {
			searchDropdownOpen: '',
			moreDropdownOpen: false,
			activeWorkNew: null,
			subworksTitle: 'Book'
		};

		// methods:
		if (props.handleChangeTextsearch) this.handleChangeTextsearch = _.debounce(props.handleChangeTextsearch, 300);
		this.toggleSearchDropdown = this.toggleSearchDropdown.bind(this);
		this.toggleMoreDropdown = this.toggleMoreDropdown.bind(this);
		this.switchToHymns = this.switchToHymns.bind(this);
		this.switchToBooks = this.switchToBooks.bind(this);
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
	}


	render() {

		const { toggleSearchTerm, filters, addCommentPage, keywords, keyideas, commenters, referenceWorks, works, handleChangeLineN } = this.props;
		const { searchDropdownOpen, moreDropdownOpen, subworksTitle } = this.state;

		const lineFrom = getLineFrom(filters);
		const lineTo = getLineTo(filters);
		const workInFilter = getWorkInFilter(filters);
		const subdomain = window.location.hostname.split('.')[0];

		return (
			<span>
				{!addCommentPage ?
					<div className="search-tool text-search text-search--header">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={this.handleChangeTextsearch}
						/>
					</div>
				: '' }

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

				<SubworksDropdown
					works={works}
					searchDropdownOpen={searchDropdownOpen}
					toggleSearchDropdown={this.toggleSearchDropdown}
					toggleSearchTerm={toggleSearchTerm}
					selectedWork={subworksTitle}
					workInFilter={workInFilter}
					filters={filters}
				/>

				{subdomain === 'pausanias' ?
					<ChaptersDropdown
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
						workInFilter={workInFilter}
						filters={filters}
					/>
				: ''}

				<div
					style={{ width: 250, padding: '10px 20px' }}
					className={`line-search ${(workInFilter === false) ? 'disabled' : ''}`}
				>
					<LineRangeSlider
						handleChangeLineN={handleChangeLineN}
						lineFrom={lineFrom}
						lineTo={lineTo}
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

					</SearchToolDropdown>}

			</span>
		);
	}
}
/*
	END CommentarySearchToolbar
*/


const commentarySearchToolbarContainer = createContainer(({ addCommentPage }) => {

	const tenantId = Session.get('tenantId');

	// SUBSCRIPTIONS:
	if (!addCommentPage) {
		Meteor.subscribe('commenters');
		Meteor.subscribe('keywords.all', {tenantId: tenantId});
		Meteor.subscribe('referenceWorks', tenantId);
	}
	Meteor.subscribe('works', tenantId);

	return {
		keyideas: Keywords.find({ type: 'idea' }).fetch(),
		keywords: Keywords.find({ type: 'word' }).fetch(),
		commenters: Commenters.find().fetch(),
		works: Works.find({}, { sort: { order: 1 } }).fetch(),
		referenceWorks: ReferenceWorks.find({}, { sort: { title: 1 } }).fetch(),
	};

}, CommentarySearchToolbar);

export default commentarySearchToolbarContainer;
