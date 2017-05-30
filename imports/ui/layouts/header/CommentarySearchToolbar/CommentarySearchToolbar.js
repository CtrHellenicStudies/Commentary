import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';

// api:
import Commenters from '/imports/api/collections/commenters';
import Keywords from '/imports/api/collections/keywords';
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import Works from '/imports/api/collections/works';

// components:
import { KeywordsDropdown, KeyideasDropdown, CommentatorsDropdown, ReferenceDropdown, WorksDropdown, SubworksDropdown } from '/imports/ui/components/header/SearchDropdowns';
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
		filters: React.PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
		toggleSearchTerm: React.PropTypes.func.isRequired,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func.isRequired,
		addCommentPage: React.PropTypes.bool.isRequired,
		isTest: React.PropTypes.bool,

		// from createContainer:
		keywords: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
		})),
		keyideas: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
		})),
		commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
		})),
		referenceWorks: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
		})),
		works: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
			subworks: React.PropTypes.arrayOf(React.PropTypes.shape({
				n: React.PropTypes.number.isRequired,
				title: React.PropTypes.string.isRequired,
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
			})
		}
	}


	render() {

		const { toggleSearchTerm, filters, addCommentPage, keywords, keyideas, commenters, referenceWorks, works, handleChangeLineN, selectedWork } = this.props;
		const { searchDropdownOpen, moreDropdownOpen, subworksTitle } = this.state;

		const lineFrom = getLineFrom(filters);
		const lineTo = getLineTo(filters);
		const workInFilter = getWorkInFilter(filters);

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
