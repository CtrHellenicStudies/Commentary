import { Session } from 'meteor/session';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import Commenters from '/imports/collections/commenters'; // eslint-disable-line import/no-absolute-path
import Keywords from '/imports/collections/keywords'; // eslint-disable-line import/no-absolute-path
import ReferenceWorks from '/imports/collections/referenceWorks'; // eslint-disable-line import/no-absolute-path
import Works from '/imports/collections/works'; // eslint-disable-line import/no-absolute-path

// components:
import { KeywordsDropdown, KeyideasDropdown, CommentatorsDropdown, ReferenceDropdown, WorksDropdown } from '/imports/ui/components/header/SearchDropdowns'; // eslint-disable-line import/no-absolute-path


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

const isActive = (filters, keyword, key, valueKey = 'slug') => {
	filters.forEach((filter) => {
		if (filter.key === key) {
			filter.values.forEach((value) => {
				if (keyword.slug === value[valueKey]) {
					return true;
				}
			});
		}
	});
	return false;
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
	};

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
					/>}

				{!addCommentPage &&
					<KeyideasDropdown
						keyideas={keyideas}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
					/>}

				{!addCommentPage &&
					<CommentatorsDropdown
						commenters={commenters}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
					/>}

				{!addCommentPage &&
					<ReferenceDropdown
						reference={referenceWorks}
						searchDropdownOpen={searchDropdownOpen}
						toggleSearchDropdown={this.toggleSearchDropdown}
						toggleSearchTerm={toggleSearchTerm}
					/>}

				<WorksDropdown
					works={works}
					searchDropdownOpen={searchDropdownOpen}
					toggleSearchDropdown={this.toggleSearchDropdown}
					toggleSearchTerm={toggleSearchTerm}
				/>

				<SearchToolDropdown
					name={selectedWork}
					open={searchDropdownOpen === 'Book' || searchDropdownOpen === 'Hymn'}
					toggle={this.toggleSearchDropdown}
					disabled={workInFilter === false}
				>
					{works.map((work) => {
						const workIsAvtive = isActive(filters, work, 'works');
						if (workIsAvtive) {
							const SearchTermButtons = work.subworks.map(subwork => (
								<SearchTermButton
									key={subwork.n}
									toggleSearchTerm={toggleSearchTerm}
									label={`${work.title} ${subwork.title}`}
									searchTermKey="subworks"
									value={subwork}
									active={isActive(filters, subwork, 'subworks', 'n')}
								/>
							));
							return SearchTermButtons;
						}
						return null;
					})}
				</SearchToolDropdown>

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

						<SearchToolDropdown
							name="Keywords"
							open={searchDropdownOpen === 'Keywords'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{keywords.map(keyword => (
								<SearchTermButton
									key={keyword._id}
									toggleSearchTerm={toggleSearchTerm}
									label={keyword.title}
									searchTermKey="keywords"
									value={keyword}
									active={isActive(filters, keyword, 'keywords')}
								/>
							))}
						</SearchToolDropdown>

						<SearchToolDropdown
							name="Key Ideas"
							open={searchDropdownOpen === 'Key Ideas'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{keyideas.map(keyidea => (
								<SearchTermButton
									key={keyidea._id}
									toggleSearchTerm={toggleSearchTerm}
									label={keyidea.title}
									searchTermKey="keyideas"
									value={keyidea}
									active={isActive(filters, keyidea, 'keyideas')}
								/>
							))}
						</SearchToolDropdown>

						<SearchToolDropdown
							name="Commentator"
							open={searchDropdownOpen === 'Commentator'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{commenters.map(commenter => (
								<SearchTermButton
									key={commenter._id}
									toggleSearchTerm={toggleSearchTerm}
									label={commenter.name}
									searchTermKey="commenters"
									value={commenter}
									active={isActive(filters, commenter, 'commenters')}
								/>
							))}
						</SearchToolDropdown>

						<SearchToolDropdown
							name="reference"
							open={searchDropdownOpen === 'reference'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{referenceWorks.map(reference => (
								<SearchTermButton
									key={reference._id}
									toggleSearchTerm={toggleSearchTerm}
									label={Utils.trunc(reference.title, 30)}
									searchTermKey="reference"
									value={reference}
									active={isActive(filters, reference, 'reference', 'title')}
								/>
							))}
						</SearchToolDropdown>

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
