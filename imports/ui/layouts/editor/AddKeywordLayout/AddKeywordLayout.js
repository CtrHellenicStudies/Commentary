import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { Roles } from 'meteor/alanning:roles';
import { compose } from 'react-apollo';
import slugify from 'slugify';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// graphql
import { keywordInsertMutation } from '/imports/graphql/methods/keywords';

// components:
import Header from '/imports/ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';
import Spinner from '/imports/ui/components/loading/Spinner';
import CommentLemmaSelect from '/imports/ui/components/editor/addComment/CommentLemmaSelect';
import AddKeyword from '/imports/ui/components/editor/keywords/AddKeyword';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


const AddKeywordLayout = React.createClass({

	propTypes: {
		ready: PropTypes.bool,
		isTest: PropTypes.bool,
		history: PropTypes.object,
		keywordInsert: PropTypes.func
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			selectedType: 'word',
			contextReaderOpen: true,
			loading: false,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	componentWillUpdate() {
		this.handlePermissions();
	},

	getWork() {
		let work = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
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
			if (filter.key === 'subworks') {
				subwork = filter.values[0];
			}
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
			lineLetter = this.state.lineLetterValue;
		}
		return lineLetter;
	},

	getCommenter(formData) {
		let commenter = null;
		if (Meteor.user().canEditCommenters.length > 1) {
			commenter = Commenters.findOne({
				_id: formData.commenterValue.value,
			});
		} else {
			commenter = Commenters.find({
				_id: Meteor.user().canEditCommenters,
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

	// --- BEGIN LINE SELECTION --- //

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
					filters[i].values.push(value);
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

	// --- END LINE SELECTION --- //

	// --- BEGNI ADD COMMENT --- //

	addKeyword(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});
		const that = this;
		// get data for keyword :
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const selectedLineTo = this.getSelectedLineTo();
		const token = Cookies.get('loginToken');

		// create keyword object to be inserted:
		const keyword = {
			work: {
				title: work.title,
				slug: work.slug,
				order: work.order,
			},
			subwork: {
				title: subwork.title, 
				n: subwork.n,
			},
			lineFrom: this.state.selectedLineFrom,
			lineTo: selectedLineTo,
			lineLetter,
			title: formData.titleValue,
			slug: slugify(formData.titleValue.toLowerCase()),
			description: textValue,
			descriptionRaw: textRawValue,
			type: this.state.selectedType,
			count: 1,
			tenantId: sessionStorage.getItem('tenantId'),
		};
		this.props.keywordInsert(keyword).then(function() {
			that.props.history.push(`/tags/${keyword.slug}`);
		}
		);
		// 	if (error) {
		// 		this.showSnackBar(error);
		// 	} else {
		// 		this.props.history.push(`/tags/${keyword.slug}`);
		// 	}
		// });
	},

	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		this.timeout = setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	},
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	},
	onTypeChange(type) {
		this.setState({
			selectedType: type,
		});
	},

	// --- BEGNI PERMISSIONS HANDLE --- //

	handlePermissions() {
		if (Roles.subscription.ready()) {
			if (!Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter'])) {
				this.props.history.push('/');
			}
		}
	},

	// --- END PERMISSIONS HANDLE --- //


	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
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
		const { filters, loading } = this.state;
		const { ready, isTest } = this.props;
		let work;
		let subwork;
		let lineFrom;
		let lineTo;

		Utils.setTitle('Add Tag | The Center for Hellenic Studies Commentaries');

		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			} else if (filter.key === 'subworks') {
				subwork = filter.values[0];
			} else if (filter.key === 'lineTo') {
				lineTo = filter.values[0];
			} else if (filter.key === 'lineFrom') {
				lineFrom = filter.values[0];
			}
		});

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<div>
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
							selectedWork={this.getWork(filters)}
						/>

						{!isTest ?
							<main>

								<div className="commentary-comments">
									<div className="comment-group">
										<CommentLemmaSelect
											ref={(component) => { this.commentLemmaSelect = component; }}
											lineFrom={this.state.selectedLineFrom}
											lineTo={this.state.selectedLineTo}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
											shouldUpdateQuery={this.state.updateQuery}
											updateQuery={this.updateQuery}
										/>
										<AddKeyword
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											submitForm={this.addKeyword}
											onTypeChange={this.onTypeChange}
										/>
										<ContextPanel
											open={this.state.contextReaderOpen}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
											lineFrom={lineFrom || 1}
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											updateSelectedLines={this.updateSelectedLines}
											editor
										/>
									</div>
								</div>

								<FilterWidget
									filters={filters}
									toggleSearchTerm={this.toggleSearchTerm}
								/>

							</main>
						: ''}
					</div>
				</div>
			</MuiThemeProvider>
		);
	},
});

const AddKeywordLayoutContainer = (() => {
	const ready = Roles.subscription.ready();
	return {
		ready,
	};
}, AddKeywordLayout);

export default (keywordInsertMutation)(AddKeywordLayoutContainer);
