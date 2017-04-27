import { Session } from 'meteor/session';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// api:
import Commenters from '/imports/collections/commenters'; // eslint-disable-line import/no-absolute-path
import Keywords from '/imports/collections/keywords'; // eslint-disable-line import/no-absolute-path
import ReferenceWorks from '/imports/collections/referenceWorks'; // eslint-disable-line import/no-absolute-path
import Works from '/imports/collections/works'; // eslint-disable-line import/no-absolute-path

// components:
import LineRangeSlider from '/imports/ui/components/header/LineRangeSlider'; // eslint-disable-line import/no-absolute-path
import SearchTermButtonPanel from '/imports/ui/components/header/SearchTermButtonPanel'; // eslint-disable-line import/no-absolute-path
import { WorksCard } from '/imports/ui/components/header/SearchCards'; // eslint-disable-line import/no-absolute-path


const CommentarySearchPanel = React.createClass({

	propTypes: {
		filters: React.PropTypes.array,
		toggleSearchTerm: React.PropTypes.func,
		handleChangeTextsearch: React.PropTypes.func,
		handleChangeLineN: React.PropTypes.func,
		open: React.PropTypes.bool,
		closeRightMenu: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			subworks: [],
			activeWork: '',
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
			Meteor.subscribe('commenters', Session.get('tenantId'));
			Meteor.subscribe('keywords.all', {tenantId: Session.get('tenantId')});
			Meteor.subscribe('referenceWorks', Session.get('tenantId'));
		}
		Meteor.subscribe('works', Session.get('tenantId'));

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

	handleChangeTextsearch() {
		this.props.handleChangeTextsearch($('.text-search--drawer input').val());
	},

	render() {
		const self = this;
		const filters = this.props.filters || [];

		const styles = {
			drawer: {
				backgroundColor: '#ddd',
			},
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
			cardHeader: {
				fontFamily: 'Proxima N W01 At Smbd',
				textTransform: 'uppercase',
				fontSize: '14px',
				fontWeight: 'bold',
			},
			lineSearch: {
				width: '99%',
				margin: '0px auto',
			},
		};

		drawerWidth = 400;
		if (window.innerWidth < 500) {
			drawerWidth = 300;
		}
		if (window.innerWidth < 300) {
			drawerWidth = 210;
		}

		return (
			<Drawer
				width={drawerWidth}
				className="search-tools-drawer"
				openSecondary
				open={this.props.open}
				docked={false}
				onRequestChange={this.props.closeRightMenu}
				style={styles.drawer}
			>
				<div className="search-tool text-search text-search--drawer">
					<TextField
						hintText=""
						floatingLabelText="Search"
						fullWidth
						onChange={_.debounce(this.handleChangeTextsearch, 300)}
					/>
				</div>

				<WorksCard
					works={this.data.works}
					toggleWorkSearchTerm={this.toggleWorkSearchTerm}
					styles={styles}
					filters={filters}
				/>
				
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Book"
						style={styles.cardHeader}
						actAsExpander={!(self.state.subworks.length === 0)}
						showExpandableButton={!(self.state.subworks.length === 0)}
						className={`card-header ${(self.state.subworks.length === 0) ? '' : 'card-header--disabled'}`}
					/>
					<CardText expandable style={styles.wrapper}>
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
								<SearchTermButtonPanel
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={`${subwork.work.title} ${subwork.title}`}
									searchTermKey="subworks"
									value={subwork}
									active={active}
								/>
							);
						})}
					</CardText>
				</Card>
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Line Number"
						style={styles.cardHeader}
						actAsExpander={!(self.state.subworks.length === 0)}
						showExpandableButton={!(self.state.subworks.length === 0)}
						className={`card-header ${(self.state.subworks.length === 0) ? '' : 'card-header--disabled'}`}
					/>
					<CardText expandable style={styles.wrapper}>
						<div style={styles.lineSearch} className="line-search">
							<LineRangeSlider
								handleChangeLineN={this.props.handleChangeLineN}
							/>
						</div>
					</CardText>
				</Card>
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Keywords"
						style={styles.cardHeader}
						actAsExpander
						showExpandableButton
						className="card-header"
					/>
					<CardText expandable style={styles.wrapper}>
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
								<SearchTermButtonPanel
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={keyword.title}
									searchTermKey="keywords"
									value={keyword}
									active={active}
								/>
							);
						})}
					</CardText>
				</Card>
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Key Ideas"
						style={styles.cardHeader}
						actAsExpander
						showExpandableButton
						className="card-header"
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.keyideas.map((keyidea, i) => {
							let active = false;
							filters.forEach((filter) => {
								if (filter.key === 'keyideas') {
									filter.values.forEach((value) => {
										if (keyidea._id === value._id) {
											active = true;
										}
									});
								}
							});

							return (
								<SearchTermButtonPanel
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={keyidea.title}
									searchTermKey="keyideas"
									value={keyidea}
									active={active}
								/>
							);
						})}
					</CardText>
				</Card>
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Commentator"
						style={styles.cardHeader}
						actAsExpander
						showExpandableButton
						className="card-header"
					/>
					<CardText expandable style={styles.wrapper}>
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
								<SearchTermButtonPanel
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={commenter.name}
									searchTermKey="commenters"
									value={commenter}
									active={active}
								/>
							);
						})}
					</CardText>
				</Card>
				<Card
					className="search-tool-card"
				>
					<CardHeader
						title="Reference"
						style={styles.cardHeader}
						actAsExpander
						showExpandableButton
						className="card-header"
					/>
					<CardText expandable style={styles.wrapper}>
						{self.data.referenceWorks.map((reference, i) => {
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
								<SearchTermButtonPanel
									key={i}
									toggleSearchTerm={self.toggleSearchTerm}
									label={Utils.trunc(reference.title, 30)}
									searchTermKey="reference"
									value={reference}
									active={active}
								/>
							);
						})}
					</CardText>
				</Card>
			</Drawer>
		);
	},
});

export default CommentarySearchPanel;
