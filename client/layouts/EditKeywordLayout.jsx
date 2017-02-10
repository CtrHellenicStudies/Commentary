import { Session } from 'meteor/session';
import slugify from 'slugify';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'mdi/css/materialdesignicons.css';

EditKeywordLayout = React.createClass({

	propTypes: {
		slug: React.PropTypes.string,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			selectedType: 'word',
			loading: false,
			snackbarOpen: false,
			snackbarMessage: '',
			contextReaderOpen: true,
		};
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentWillUpdate() {
		if (this.data.ready) this.handlePermissions();
	},

	getMeteorData() {
		const keywordsSub = Meteor.subscribe('keywords.slug', this.props.slug, Session.get("tenantId"));
		const ready = Roles.subscription.ready() && keywordsSub;
		let keyword = {};
		if (ready) {
			keyword = Keywords.findOne({slug: this.props.slug});
		}

		return {
			ready,
			keyword,
		};
	},

	handlePermissions() {
		if (Roles.subscription.ready()) {
			if (!Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'keyworder'])) {
				FlowRouter.go('/');
			}
		}
	},

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
		} else if (selectedLineTo != null && selectedLineTo != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		} else {
			// do nothing
		}
	},

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;

				filter.values.forEach((filterValue, j) => {
					if (filterValue._id === value._id) {
						valueIsInFilter = true;
						filterValueToRemove = j;
					}
				});

				if (valueIsInFilter) {
					filter.values.splice(filterValueToRemove, 1);
					if (filter.values.length === 0) {
						filterToRemove = i;
					}
				} else if (key === 'works') {
					filters[i].values = [value];
				} else {
					filter.values.push(value);
				}
			}
		});


		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}

		if (!keyIsInFilter) {
			filters.push({
				key,
				values: [value],
			});
		}

		this.setState({
			filters,
			skip: 0,
		});
	},

	updateKeyword(formData) {

		this.setState({
			loading: true,
		});

		// get data for keyword :
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const selectedLineTo = this.getSelectedLineTo();
		const type = this.getType();

		// create keyword object to be inserted:
		const keyword = {
			_id: this.data.keyword._id,
			work: {
				title: work.title,
				slug: work.slug,
				order: work.order,
			},
			subwork: {
				title: subwork.title,
				n: subwork.n,
			},
			lineFrom: this.state.selectedLineFrom || this.data.keyword.lineFrom,
			lineTo: selectedLineTo || this.data.keyword.lineTo,
			lineLetter,
			title: formData.titleValue,
			slug: slugify(formData.titleValue.toLowerCase()),
			description: formData.textValue,
			type: this.state.selectedType,
			count: 1,
			created: new Date(),
		};

		Meteor.call('keywords.update', keyword, (error, keywordId) => {
			if (error) {
				this.showSnackBar(error);
			} else {
				FlowRouter.go(`/keywords/${keyword.slug}`);
			}
		});
	},

	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	},

	getWork() {
		let work = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'work') {
				work = values[0];
			}
		});
		if (!work) {
			work = {
				title: 'Iliad',
				slug: 'iliad',
				order: 1,
			};
		}
		return work;
	},

	getSubwork() {
		let subwork = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'subwork') {
				subwork = values[0];
			};
		});
		if (!subwork) {
			subwork = {
				title: '1',
				n: 1,
			};
		}
		return subwork;
	},

	getLineLetter() {
		let lineLetter = '';
		if (this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) {
			lineLetter = this.commentLemmaSelect.state.lineLetterValue;
		}
		return lineLetter;
	},

	getCommenter(formData) {
		let commenter = null;
		if (Meteor.user().commenterId.length > 1) {
			commenter = Commenters.findOne({
				_id: formData.commenterValue.value,
			});
		} else {
			commenter = Commenters.find({
				_id: Meteor.user().commenterId,
			});
		}
		return commenter;
	},

	getSelectedLineTo() {
		let selectedLineTo = 0;
		if (this.state.selectedLineTo === 0) {
			selectedLineTo = this.state.selectedLineFrom;
		} else {
			selectedLineTo = this.state.selectedLineTo;
		}
		return selectedLineTo;
	},

	getType() {
		return this.state.selectedType;
	},

	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
		});
	},

	onTypeChange(type) {
		console.log(type);
		this.setState({
			selectedType: type,
		});
	},

	handleChangeLineN(e) {
		const filters = this.state.filters;

		if (e.from > 1) {
			let lineFromInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filters[i].values = [e.from];
					lineFromInFilters = true;
				}
			});

			if (!lineFromInFilters) {
				filters.push({
					key: 'lineFrom',
					values: [e.from],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		if (e.to < 2100) {
			let lineToInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filters[i].values = [e.to];
					lineToInFilters = true;
				}
			});

			if (!lineToInFilters) {
				filters.push({
					key: 'lineTo',
					values: [e.to],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this.setState({
			filters,
		});
	},

	render() {
		const filters = this.state.filters;
		const keyword = this.data.keyword;

		return (
			<div>
				{this.data.ready && this.data.keyword ?
					<div className="chs-layout edit-keyword-layout">

						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>

						<main>

							<div className="commentary-comments">
								<div className="comment-group">
									<CommentLemmaSelect
										ref={(component) => { this.keywordLemmaSelect = component; }}
										selectedLineFrom={this.state.selectedLineFrom || keyword.lineFrom || 0}
										selectedLineTo={this.state.selectedLineTo || keyword.lineTo || 0}
										workSlug={('work' in keyword) ? keyword.work.slug : 'iliad'}
										subworkN={('subwork' in keyword) ? keyword.subwork.n : 1}
									/>

									<EditKeyword
										selectedLineFrom={this.state.selectedLineFrom || keyword.lineFrom || null}
										selectedLineTo={this.state.selectedLineTo || keyword.lineTo || null}
										submitForm={this.updateKeyword}
										onTypeChange={this.onTypeChange}
										keyword={keyword}
									/>

									<ContextReader
										open={this.state.contextReaderOpen}
										closeContextPanel={this.closeContextReader}
										workSlug={'work' in keyword ? keyword.work.slug : 'iliad'}
										subworkN={'subwork' in keyword ? keyword.subwork.n : 1}
										selectedLineFrom={this.state.selectedLineFrom || keyword.lineFrom || 0}
										selectedLineTo={this.state.selectedLineTo || keyword.lineTo || 0}
										initialLineFrom={keyword.lineFrom || 1}
										initialLineTo={keyword.lineFrom ? keyword.lineFrom + 100 : 100}
										updateSelectedLines={this.updateSelectedLines}
									/>
								</div>
							</div>
						</main>

						<FilterWidget
							filters={filters}
							toggleSearchTerm={this.toggleSearchTerm}
						/>
					</div>
					:
					<Spinner fullPage />
				}
				<Snackbar
					className="add-comment-snackbar"
					open={this.state.snackbarOpen}
					message={this.state.snackbarMessage}
					autoHideDuration={4000}
				/>
			</div>
		);
	},
});
