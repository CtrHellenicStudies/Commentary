import { Session } from 'meteor/session';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Commenters from '/imports/collections/commenters';
import Keywords from '/imports/collections/keywords';
import ReferenceWorks from '/imports/collections/referenceWorks';
import Works from '/imports/collections/works';

CommentarySearchToolbar = React.createClass({

	propTypes: {
		filters: React.PropTypes.array.isRequired,
		toggleSearchTerm: React.PropTypes.func.isRequired,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func.isRequired,
		addCommentPage: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			searchDropdownOpen: '',
			moreDropdownOpen: false,
			activeWorkNew: null,
			selectedWork: 'Book',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		// SUBSCRIPTIONS:
		let works = [];
		let keywords = [];
		let keyideas = [];
		let commenters = [];
		let referenceWorks = [];

		if (!this.props.addCommentPage) {
			Meteor.subscribe('commenters');
			Meteor.subscribe('keywords.all', {tenantId: Session.get('tenantId')});
			Meteor.subscribe('referenceWorks', Session.get('tenantId'));
		}
		Meteor.subscribe('works');

		// FETCH DATA:
		keyideas = Keywords.find({ type: 'idea' }).fetch();
		keywords = Keywords.find({ type: 'word' }).fetch();
		commenters = Commenters.find().fetch();
		works = Works.find({}, { sort: { order: 1 } }).fetch();
		referenceWorks = ReferenceWorks.find({}, { sort: { title: 1 } }).fetch();

		return {
			keyideas,
			keywords,
			commenters,
			works,
			referenceWorks,
		};
	},

	toggleSearchTerm(key, value) {
		this.props.toggleSearchTerm(key, value);
	},

	handleChangeTextsearch() {
		this.props.handleChangeTextsearch($('.text-search--header input').val());
	},

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
	},

	toggleMoreDropdown() {
		this.setState({
			moreDropdownOpen: !this.state.moreDropdownOpen,
		});
	},

	switchToHymns() {
		this.setState({
			selectedWork: 'Hymn',
		});
	},

	switchToBooks() {
		this.setState({
			selectedWork: 'Book',
		});
	},

	render() {
		const self = this;
		const filters = this.props.filters;

		const styles = {
			lineSearch: {
				width: 250,
				padding: '10px 20px',
			},
		};

		const filterLineFrom = this.props.filters.find((filter) =>
			filter.key === 'lineFrom'
		);
		const filterLineTo = this.props.filters.find((filter) =>
			filter.key === 'lineTo'
		);
		let lineFrom = null;
		let lineTo = null;
		if (filterLineFrom) {
			lineFrom = filterLineFrom.values[0];
		}
		if (filterLineTo) {
			lineTo = filterLineTo.values[0];
		}

		const addCommentPage = this.props.addCommentPage;

		let workInFilter = false;
		filters.forEach((filter) => {
			if (filter.key === 'works') {
				workInFilter = true;
			}
		});

		return (
			<span>
				{!addCommentPage ?
					<div className="search-tool text-search text-search--header">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={_.debounce(this.handleChangeTextsearch, 300)}
						/>
					</div>
				: '' }

				{!addCommentPage ?
					<SearchToolDropdown
						name="Keywords"
						open={this.state.searchDropdownOpen === 'Keywords'}
						toggle={this.toggleSearchDropdown}
						disabled={false}
					>
						{this.data.keywords.map((keyword, i) => {
							let active = false;
							filters.forEach((filter) => {
								if (filter.key === 'keywords') {
									filter.values.forEach((value) => {
										if (keyword.slug === value.slug) {
											active = true;
										}
									});
								}
							});

							return (
								<SearchTermButton
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={keyword.title}
									searchTermKey="keywords"
									value={keyword}
									active={active}
								/>
							);
						})}
					</SearchToolDropdown>
				: ''}

				{!addCommentPage ?
					<SearchToolDropdown
						name="Key Ideas"
						open={this.state.searchDropdownOpen === 'Key Ideas'}
						toggle={this.toggleSearchDropdown}
						disabled={false}
					>
						{this.data.keyideas.map((keyidea, i) => {
							let active = false;
							filters.forEach((filter) => {
								if (filter.key === 'keyideas') {
									filter.values.forEach((value) => {
										if (keyidea.slug === value.slug) {
											active = true;
										}
									});
								}
							});

							return (
								<SearchTermButton
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={keyidea.title}
									searchTermKey="keyideas"
									value={keyidea}
									active={active}
								/>
							);
						})}
					</SearchToolDropdown>
				: ''}
				{!addCommentPage ?
					<SearchToolDropdown
						name="Commentator"
						open={this.state.searchDropdownOpen === 'Commenter'}
						toggle={this.toggleSearchDropdown}
						disabled={false}
					>
						{this.data.commenters.map((commenter, i) => {
							let active = false;
							filters.forEach((filter) => {
								if (filter.key === 'commenters') {
									filter.values.forEach((value) => {
										if (commenter.slug === value.slug) {
											active = true;
										}
									});
								}
							});

							return (
								<SearchTermButton
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={commenter.name}
									searchTermKey="commenters"
									value={commenter}
									active={active}
								/>
							);
						})}
					</SearchToolDropdown>
				: ''}
				{!addCommentPage ?
					<SearchToolDropdown
						name="reference"
						open={this.state.searchDropdownOpen === 'reference'}
						toggle={this.toggleSearchDropdown}
						disabled={false}
					>
						{this.data.referenceWorks.map((reference, i) => {
							let active = false;
							filters.forEach((filter) => {
								if (filter.key === 'reference') {
									filter.values.forEach((value) => {
										if (reference.title === value.title) {
											active = true;
										}
									});
								}
							});

							return (
								<SearchTermButton
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={Utils.trunc(reference.title, 30)}
									searchTermKey="reference"
									value={reference}
									active={active}
								/>
							);
						})}
					</SearchToolDropdown>
				: ''}

				<SearchToolDropdown
					name="Work"
					open={this.state.searchDropdownOpen === 'Work'}
					toggle={this.toggleSearchDropdown}
					disabled={false}
				>
					{this.data.works.map((work, i) => {
						let active = false;
						filters.forEach((filter) => {
							if (filter.key === 'works') {
								filter.values.forEach((value) => {
									if (work.slug === value.slug) {
										active = true;
									}
								});
							}
						});
						return (
							<SearchTermButton
								key={i}
								toggleSearchTerm={self.toggleSearchTerm}
								label={work.title}
								searchTermKey="works"
								value={work}
								activeWork={active}
								/*
								switchSubworks={
									(work.title === 'Homeric Hymns') ?
										this.switchToHymns
									: this.switchToBooks
								}*/
							/>
						);
					})}
				</SearchToolDropdown>

				<SearchToolDropdown
					name={this.state.selectedWork}
					open={this.state.searchDropdownOpen === 'Book' || this.state.searchDropdownOpen === 'Hymn'}
					toggle={this.toggleSearchDropdown}
					disabled={workInFilter === false}
				>
					{this.data.works.map((work, i) => {
						let workFound = false;
						filters.forEach((filter) => {
							if (filter.key === 'works') {
								filter.values.forEach((value) => {
									if (work.slug === value.slug) {
										workFound = true;
									}
								});
							}
						});
						if (workFound) {
							const SearchTermButtons = work.subworks.map((subwork, i) => {
								let active = false;
								filters.forEach((filter) => {
									if (filter.key === 'subworks') {
										filter.values.forEach((value) => {
											if (subwork.n === value.n) {
												active = true;
											}
										});
									}
								});
								return (
									<SearchTermButton
										key={i}
										toggleSearchTerm={self.toggleSearchTerm}
										label={`${work.title} ${subwork.title}`}
										searchTermKey="subworks"
										value={subwork}
										active={active}
									/>
								);
							});
							return SearchTermButtons;
						}
					})}
				</SearchToolDropdown>
				<div
					style={styles.lineSearch}
					className={`line-search ${(workInFilter === false) ? 'disabled' : ''}`}
				>
					<LineRangeSlider
						handleChangeLineN={this.props.handleChangeLineN}
						lineFrom={lineFrom}
						lineTo={lineTo}
					/>
					<div className="disabled-screen" />
				</div>

				{!addCommentPage ?
					<SearchToolDropdown
						name="more"
						open={this.state.moreDropdownOpen}
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
							open={this.state.searchDropdownOpen === 'Keywords'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{this.data.keywords.map((keyword, i) => {
								let active = false;
								filters.forEach((filter) => {
									if (filter.key === 'keywords') {
										filter.values.forEach((value) => {
											if (keyword.slug === value.slug) {
												active = true;
											}
										});
									}
								});

								return (
									<SearchTermButton
										key={i}
										toggleSearchTerm={self.toggleSearchTerm}
										label={keyword.title}
										searchTermKey="keywords"
										value={keyword}
										active={active}
									/>
								);
							})}
						</SearchToolDropdown>
						<SearchToolDropdown
							name="Key Ideas"
							open={this.state.searchDropdownOpen === 'Key Ideas'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{this.data.keyideas.map((keyidea, i) => {
								let active = false;
								filters.forEach((filter) => {
									if (filter.key === 'keyideas') {
										filter.values.forEach((value) => {
											if (keyidea.slug === value.slug) {
												active = true;
											}
										});
									}
								});

								return (
									<SearchTermButton
										key={i}
										toggleSearchTerm={self.toggleSearchTerm}
										label={keyidea.title}
										searchTermKey="keyideas"
										value={keyidea}
										active={active}
									/>
								);
							})}
						</SearchToolDropdown>
						<SearchToolDropdown
							name="Commentator"
							open={this.state.searchDropdownOpen === 'Commentator'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{this.data.commenters.map((commenter, i) => {
								let active = false;
								filters.forEach((filter) => {
									if (filter.key === 'commenters') {
										filter.values.forEach((value) => {
											if (commenter.slug === value.slug) {
												active = true;
											}
										});
									}
								});

								return (
									<SearchTermButton
										key={i}
										toggleSearchTerm={self.toggleSearchTerm}
										label={commenter.name}
										searchTermKey="commenters"
										value={commenter}
										active={active}
									/>
								);
							})}
						</SearchToolDropdown>
						<SearchToolDropdown
							name="reference"
							open={this.state.searchDropdownOpen === 'reference'}
							toggle={this.toggleSearchDropdown}
							disabled={false}
						>
							{this.data.referenceWorks.map((reference, i) => {
								let active = false;
								filters.forEach((filter) => {
									if (filter.key === 'reference') {
										filter.values.forEach((value) => {
											if (reference.title === value.title) {
												active = true;
											}
										});
									}
								});

								return (
									<SearchTermButton
										key={i}
										toggleSearchTerm={self.toggleSearchTerm}
										label={Utils.trunc(reference.title, 30)}
										searchTermKey="reference"
										value={reference}
										active={active}
									/>
								);
							})}
						</SearchToolDropdown>
					</SearchToolDropdown>
				: ''}

			</span>
		);
	},
});
