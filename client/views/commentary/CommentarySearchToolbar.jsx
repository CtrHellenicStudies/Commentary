import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';

CommentarySearchToolbar = React.createClass({

	propTypes: {
		filters: React.PropTypes.array,
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func,
        works: React.PropTypes.array.isRequired,
        keywords: React.PropTypes.array.isRequired,
        commenters: React.PropTypes.array.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		const filters = this.props.filters;

		let activeWork = '';
		let subworks = [];
		if (filters) {
			filters.forEach((filter) => {
				if (filter.key === 'works') {
					activeWork = filter.values[0].slug;
				}
			});
			filters.forEach((filter) => {
				if (filter.key === 'subworks') {
					const work = this.props.works.find((work) => {
						return work.slug === activeWork;
					});
					subworks = work.subworks;
					subworks.forEach((subwork, i) => {
						subworks[i].work = work;
					});
				}
			});
		}

		return {
			searchDropdownOpen: '',
			subworks,
			activeWork,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	toggleSearchTerm(key, value) {
		this.props.toggleSearchTerm(key, value);
	},

	toggleWorkSearchTerm(key, value) {
		const work = value;

		value.subworks.forEach((subwork, i) => {
			value.subworks[i].work = work;
		});

		if (this.state.activeWork === value.slug) {
			this.setState({
				subworks: [],
				activeWork: '',
			});
		} else {
			value.subworks.sort((a, b) => {
				if (a.n < b.n) {
					return -1;
				}
				if (a.n > b.n) {
					return 1;
				}
				return 0;
			});
			this.setState({
				subworks: value.subworks,
				activeWork: value.slug,
			});
		}
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

		return (
			<span>

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
					{this.props.keywords.map((keyword, i) => {
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

				<SearchToolDropdown
					name="Commenter"
					open={this.state.searchDropdownOpen === 'Commenter'}
					toggle={this.toggleSearchDropdown}
					disabled={false}
				>
					{this.props.commenters.map((commenter, i) => {
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

				<SearchToolDropdown
					name="Work"
					open={this.state.searchDropdownOpen === 'Work'}
					toggle={this.toggleSearchDropdown}
					disabled={false}
				>
					{this.props.works.map((work, i) => {
						const activeWork = Boolean(this.state.activeWork === work.slug);
						return (
							<SearchTermButton
								key={i}
								toggleSearchTerm={this.toggleWorkSearchTerm}
								label={work.title}
								searchTermKey="works"
								value={work}
								activeWork={activeWork}
							/>
						);
					})}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Book"
					open={this.state.searchDropdownOpen === 'Book'}
					toggle={this.toggleSearchDropdown}
					disabled={this.state.subworks.length === 0}

				>
					{this.state.subworks.map((subwork, i) => {
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
								label={`${subwork.work.title} ${subwork.title}`}
								searchTermKey="subworks"
								value={subwork}
								active={active}
							/>
						);
					})}
				</SearchToolDropdown>
				<div style={styles.lineSearch} className="line-search">
					<LineRangeSlider
						handleChangeLineN={this.props.handleChangeLineN}
						lineFrom={lineFrom}
						lineTo={lineTo}
					/>
				</div>
			</span>
		);
	},
});
