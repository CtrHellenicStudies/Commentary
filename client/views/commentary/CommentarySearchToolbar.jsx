import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';

CommentarySearchToolbar = React.createClass({

	propTypes: {
		filters: React.PropTypes.array,
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			searchDropdownOpen: '',
			subworks: [],
			activeWork: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		return {
			keywords: Keywords.find({ type: 'word' }).fetch(),
			keyideas: Keywords.find({ type: 'idea' }).fetch(),
			commenters: Commenters.find().fetch(),
			works: Works.find({}, { sort: { order: 1 } }).fetch(),
			subworks: Subworks.find({}, { sort: { n: 1 } }).fetch(),
		};
	},

	toggleSearchTerm(key, value) {
		this.props.toggleSearchTerm(key, value);
	},

	toggleWorkSearchTerm(key, value) {
		const work = value;
		const newValue = value;
		newValue.subworks.forEach((subwork, i) => {
			newValue.subworks[i].work = work;
		});

		if (this.state.activeWork === newValue.slug) {
			this.setState({
				subworks: [],
				activeWork: '',
			});
		} else {
			newValue.subworks.sort((a, b) => {
				if (a.n < b.n) {
					return -1;
				}
				if (a.n > b.n) {
					return 1;
				}
				return 0;
			});
			this.setState({
				subworks: newValue.subworks,
				activeWork: newValue.slug,
			});
		}

		this.props.toggleSearchTerm(key, newValue);
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
					open={self.state.searchDropdownOpen === 'Keywords'}
					toggle={self.toggleSearchDropdown}
					disabled={false}
				>
					{self.data.keywords.map((keyword, i) => {
						let active = false;
						filters.forEach((filter) => {
							if (filter.key === 'keywords') {
								filter.values.forEach((value) => {
									if (keyword._id === value._id) {
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
					name="Keyideas"
					open={self.state.searchDropdownOpen === 'Keyideas'}
					toggle={self.toggleSearchDropdown}
					disabled={false}
				>
					{self.data.keyideas.map((keyidea, i) => {
						let active = false;
						filters.forEach((filter) => {
							if (filter.key === 'keywords') {
								filter.values.forEach((value) => {
									if (keyidea._id === value._id) {
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
								searchTermKey="keywords"
								value={keyidea}
								active={active}
							/>
						);
					})}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Commenter"
					open={self.state.searchDropdownOpen === 'Commenter'}
					toggle={self.toggleSearchDropdown}
					disabled={false}
				>
					{self.data.commenters.map((commenter, i) => {
						let active = false;
						filters.forEach((filter) => {
							if (filter.key === 'commenters') {
								filter.values.forEach((value) => {
									if (commenter._id === value._id) {
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
					name="Work"
					open={self.state.searchDropdownOpen === 'Work'}
					toggle={self.toggleSearchDropdown}
					disabled={false}
				>
					{self.data.works.map((work, i) => {
						const activeWork = (self.state.activeWork === work.slug);
						return (
							<SearchTermButton
								key={i}
								toggleSearchTerm={self.toggleWorkSearchTerm}
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
					open={self.state.searchDropdownOpen === 'Book'}
					toggle={self.toggleSearchDropdown}
					disabled={self.state.subworks.length === 0}

				>
					{self.state.subworks.map((subwork, i) => {
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
					/>
				</div>
			</span>
		);
	},
});
