import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';

CommentarySearchToolbar = React.createClass({

	propTypes: {
		filters: React.PropTypes.array,
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func,
		addCommentPage: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {

		return {
			searchDropdownOpen: '',
			activeWorkNew: null,
		};
	},

	mixins: [ReactMeteorData],

	getMeteorData() {

		// SUBSCRIPTIONS:
		if (!this.props.addCommentPage) {
			Meteor.subscribe('commenters');
			Meteor.subscribe('keywords.all');
		}
		Meteor.subscribe('works');

		// FETCH DATA:
		const keyideas = Keywords.find({ type: 'idea' }).fetch();
		const keywords = Keywords.find({ type: 'word' }).fetch();
		const commenters = Commenters.find().fetch();
		const works = Works.find({}, { sort: { order: 1 } }).fetch();

		return {
			keyideas,
			keywords,
			commenters,
			works,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	toggleSearchTerm(key, value) {
		this.props.toggleSearchTerm(key, value);
	},

	handleChangeTextsearch(event) {
		this.props.handleChangeTextsearch(event.target.value);
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

	render() {
		const self = this;
		const filters = this.props.filters;

		const styles = {
			lineSearch: {
				width: 250,
				padding: '10px 15px',
			},
		};

		const filterLineFrom = this.props.filters.find((filter) => {
			return filter.key === 'lineFrom';
		});
		const filterLineTo = this.props.filters.find((filter) => {
			return filter.key === 'lineTo';
		});
		let lineFrom = null,
			lineTo = null;
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
					<div className="search-tool text-search">
						<TextField
							hintText=""
							floatingLabelText="Search"
							onChange={this.handleChangeTextsearch}
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
									toggleSearchTerm={this.toggleSearchTerm}
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
						open={this.state.searchDropdownOpen === 'Keyideas'}
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
									toggleSearchTerm={this.toggleSearchTerm}
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
						name="Commenter"
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
									toggleSearchTerm={this.toggleSearchTerm}
									label={commenter.name}
									searchTermKey="commenters"
									value={commenter}
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
								toggleSearchTerm={this.toggleSearchTerm}
								label={work.title}
								searchTermKey="works"
								value={work}
								activeWork={active}
							/>
						);
					})}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Book"
					open={this.state.searchDropdownOpen === 'Book'}
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
										toggleSearchTerm={this.toggleSearchTerm}
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
				{!addCommentPage ?
					<div style={styles.lineSearch} className="line-search">
						<LineRangeSlider
							handleChangeLineN={this.props.handleChangeLineN}
							lineFrom={lineFrom}
							lineTo={lineTo}
						/>
					</div>
					: ''}
			</span>
		);
	},
});
