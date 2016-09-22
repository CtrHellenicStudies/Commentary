import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';

CommentarySearchToolbar = React.createClass({

	propTypes: {
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeDate: React.PropTypes.func,
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
			keywords: Keywords.find().fetch(),
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

		value.subworks.forEach((subwork, i) => {
			subworks[i].work = work;
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
				>
					{self.data.keywords.map((keyword, i) => (
						<SearchTermButton
							key={i}
							toggleSearchTerm={self.toggleSearchTerm}
							label={keyword.title}
							searchTermKey="keywords"
							value={keyword}
						/>
					))}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Commenter"
					open={self.state.searchDropdownOpen === 'Commenter'}
					toggle={self.toggleSearchDropdown}
				>
					{self.data.commenters.map((commenter, i) => (
						<SearchTermButton
							key={i}
							toggleSearchTerm={self.toggleSearchTerm}
							label={commenter.name}
							searchTermKey="commenters"
							value={commenter}
						/>
					))}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Work"
					open={self.state.searchDropdownOpen === 'Work'}
					toggle={self.toggleSearchDropdown}
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
				>
					{self.state.subworks.map((subwork, i) => (
						<SearchTermButton
							key={i}
							toggleSearchTerm={self.toggleSearchTerm}
							label={`${subwork.work.title} ${subwork.title}`}
							searchTermKey="subworks"
							value={subwork}
						/>
					))}
				</SearchToolDropdown>

				<SearchToolDropdown
					name="Date"
					open={self.state.searchDropdownOpen === 'Date'}
					toggle={self.toggleSearchDropdown}
				>
					<div className="search-tool--date">
						<DateRangeSlider
							handleChangeDate={this.props.handleChangeDate}
						/>
					</div>
				</SearchToolDropdown>
			</span>
		);
	},
});
