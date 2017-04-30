import React from 'react';
import { Session } from 'meteor/session';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import Commenters from '/imports/api/collections/commenters'; // eslint-disable-line import/no-absolute-path
import Keywords from '/imports/api/collections/keywords'; // eslint-disable-line import/no-absolute-path
import ReferenceWorks from '/imports/api/collections/referenceWorks'; // eslint-disable-line import/no-absolute-path
import Works from '/imports/api/collections/works'; // eslint-disable-line import/no-absolute-path

// components:
import { KeywordsDropdown, KeyideasDropdown, CommentatorsDropdown, ReferenceDropdown, WorksDropdown, SubworksDropdown } from '/imports/ui/components/header/SearchDropdowns'; // eslint-disable-line import/no-absolute-path
import LineRangeSlider from '/imports/ui/components/header/LineRangeSlider'; // eslint-disable-line import/no-absolute-path
import SearchToolDropdown from '/imports/ui/components/header/SearchToolDropdown'; // eslint-disable-line import/no-absolute-path


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
		handleChangeTextsearch: React.PropTypes.func.isRequired,
		handleChangeLineN: React.PropTypes.func.isRequired,
		addCommentPage: React.PropTypes.bool.isRequired,

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
	}

	constructor(props) {
		super(props);

		this.state = {
			searchDropdownOpen: '',
			moreDropdownOpen: false,
			activeWorkNew: null,
			selectedWork: 'Book',
		};

		// methods:
		this.handleChangeTextsearch = _.debounce(props.handleChangeTextsearch, 300);
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

	render() {

		const { toggleSearchTerm, filters, addCommentPage, keywords, keyideas, commenters, referenceWorks, works, handleChangeLineN } = this.props;
		const { searchDropdownOpen, moreDropdownOpen, selectedWork } = this.state;

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
					selectedWork={selectedWork}
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


export default createContainer(({ addCommentPage }) => {

	// SUBSCRIPTIONS:
	if (!addCommentPage) {
		Meteor.subscribe('commenters');
		Meteor.subscribe('keywords.all', {tenantId: Session.get('tenantId')});
		Meteor.subscribe('referenceWorks', Session.get('tenantId'));
	}
	Meteor.subscribe('works');

	return {
		keyideas: Keywords.find({ type: 'idea' }).fetch(),
		keywords: Keywords.find({ type: 'word' }).fetch(),
		commenters: Commenters.find().fetch(),
		works: Works.find({}, { sort: { order: 1 } }).fetch(),
		referenceWorks: ReferenceWorks.find({}, { sort: { title: 1 } }).fetch(),
	};

}, CommentarySearchToolbar);
