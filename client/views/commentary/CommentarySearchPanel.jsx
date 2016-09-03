import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import { Card, CardHeader, CardText } from 'material-ui/Card';

CommentarySearchPanel = React.createClass({

	propTypes: {
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeDate: React.PropTypes.func,
		open: React.PropTypes.bool,
		closeRightMenu: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			searchDropdownOpen: '',
			yearMin: 600,
			yearMax: 1700,
			scribes: [],
			illuminators: [],
			institutions: [],
			places: [],
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

	handleChangeTextsearch(event) {
		this.props.handleChangeTextsearch(event.target.value);
	},

	render() {
		const self = this;

		const styles = {
			flatButton: {
				width: 'auto',
				minWidth: 'none',
				height: '80px',
				padding: '21px 5px',
			},
			flatIconButton: {
				padding: '10px 20px',
				width: 'auto',
				minWidth: 'none',
				height: '55px',
			},
			wrapper: {
				display: 'flex',
				flexWrap: 'wrap',
			},
			textSearch: {
				width: '100%',
				padding: '0px 10px',
				background: '#f2f2f2',
			},
		};

		return (
			<Drawer
				openSecondary
				open={this.props.open}
				docked={false}
				onRequestChange={this.props.closeRightMenu}
			>
				<div style={styles.textSearch} className="search-tool text-search">
					<TextField
						hintText=""
						floatingLabelText="Search"
						fullWidth
						onChange={this.handleChangeTextsearch}
					/>
				</div>
				<Card>
					<CardHeader
						title="Date"
						actAsExpander
						showExpandableButton
					/>
					<CardText expandable style={styles.wrapper}>
						<div className="search-tool--date">
							<DateRangeSlider
								handleChangeDate={this.props.handleChangeDate}
							/>
						</div>
					</CardText>
				</Card>
				<Card>
					<CardHeader
						title="Keyword"
						actAsExpander
						showExpandableButton
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.keywords.map((keyword, i) => (
							<SearchTermButtonPanel
								key={i}
								toggleSearchTerm={self.toggleSearchTerm}
								label={keyword.title}
								searchTermKey="keywords"
								value={keyword}
							/>
						))}
						{self.data.keywords.length === 0 ?
							<div className="no-results">No keywords found in objects.</div>
							: ''
						}
					</CardText>
				</Card>
				<Card>
					<CardHeader
						title="Commenter"
						actAsExpander
						showExpandableButton
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.commenters.map((commenter, i) => (
							<SearchTermButtonPanel
								key={i}
								toggleSearchTerm={self.toggleSearchTerm}
								label={commenter.name}
								searchTermKey="commenters"
								value={commenter}
							/>
						))}
						{self.data.commenters.length === 0 ?
							<div className="no-results">No commenters found in objects.</div>
							: ''
						}
					</CardText>
				</Card>
				<Card>
					<CardHeader
						title="Work"
						actAsExpander
						showExpandableButton
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.works.map((work, i) => (
							<SearchTermButtonPanel
								key={i}
								toggleSearchTerm={self.toggleWorkSearchTerm}
								label={work.title}
								searchTermKey="works"
								value={work}
								activeWork={self.state.activeWork === work.slug}
							/>
						))}
						{self.data.works.length === 0 ?
							<div className="no-results">No works found in objects.</div>
							: ''
						}
					</CardText>
				</Card>
				<Card>
					<CardHeader
						title="Book"
						actAsExpander
						showExpandableButton
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.subworks.map((subwork, i) => (
							<SearchTermButtonPanel
								key={i}
								toggleSearchTerm={self.toggleSearchTerm}
								label={`${subwork.work.title} ${subwork.title}`}
								searchTermKey="subworks"
								value={subwork}
							/>
						))}
						{self.data.subworks.length === 0 ?
							<div className="no-results">No subworks found in objects.</div>
							: ''
						}
					</CardText>
				</Card>
			</Drawer>
		);
	},
});
