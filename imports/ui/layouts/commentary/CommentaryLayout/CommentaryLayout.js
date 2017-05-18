/*

filters – queryParams relations explanation:
“queryParams” represent state of truth
“filters” are a friendly object representation of “queryParams” passed to children components

To change the commentary filtering,
call the “this._updateRoute(filters)” method
with new “filters” object passed as first attribute.

*/
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts:
import Commentary from '/imports/ui/layouts/commentary/Commentary';
import ModalLogin from '/imports/ui/layouts/auth/ModalLogin';
import Header from '/imports/ui/layouts/header/Header';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

const CommentaryLayout = React.createClass({

	propTypes: {
		queryParams: React.PropTypes.object,
		isTest: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			modalLoginLowered: false,
			skip: 0,
			limit: 10,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	getQueryParamValue(queryParams, key, value) {
		let queryParamValue = null;
		if (queryParams[key]) {
			queryParamValue = `${queryParams[key]},${value}`;
		} else {
			queryParamValue = value;
		}

		return queryParamValue;
	},

	getFilterValue(filters, key) {
		let value = {};
		if (filters) {
			const filterKey = filters.find(filter => filter.key === key);
			if (filterKey) {
				value = filterKey.values[0];
			}
		}
		return value;
	},

	_updateRoute(filters) {
		let queryParams = {};
		if (filters) {
			queryParams = this._createQueryParamsFromFilters(filters);
		} else {
			queryParams = this.props.queryParams;
		}

		// update route
		FlowRouter.go('/commentary/', {}, queryParams);
	},

	_createQueryParamsFromFilters(filters) {
		const queryParams = {};
		filters.forEach((filter) => {
			filter.values.forEach((value) => {
				const getQueryParamValue = this.getQueryParamValue;
				switch (filter.key) {
				case 'works':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value.slug);
					break;
				case 'subworks':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value.title);
					break;
				case 'keyideas':
				case 'keywords':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value.slug);
					break;
				case 'commenters':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value.slug);
					break;
				case 'lineFrom':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value);
					break;
				case 'lineTo':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value);
					break;
				case 'textsearch':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value);
					break;
				case 'wordpressId':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value);
					break;
				case 'reference':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value.title);
					break;
				case '_id':
					queryParams[filter.key] = getQueryParamValue(queryParams, filter.key, value);
					break;
				default:
					break;
				}
			});
		});
		return queryParams;
	},

	_createFilterFromQueryParams(queryParams) {
		const filters = [];

		if (!queryParams) {
			return filters;
		}

		if ('_id' in queryParams) {
			filters.push({
				key: '_id',
				values: [this.props.queryParams._id],
			});
			if ('revision' in this.props.queryParams) {
				filters.push({
					key: 'revision',
					values: [Number(this.props.queryParams.revision)],
				});
			}
		}

		if ('textsearch' in this.props.queryParams) {
			filters.push({
				key: 'textsearch',
				values: [this.props.queryParams.textsearch],
			});
		}

		if ('keyideas' in queryParams) {
			const keyideas = [];

			this.props.queryParams.keyideas.split(',').forEach((keyidea) => {
				keyideas.push({
					slug: keyidea,
				});
			});

			filters.push({
				key: 'keyideas',
				values: keyideas,
			});
		}

		if ('keywords' in queryParams) {
			const keywords = [];

			this.props.queryParams.keywords.split(',').forEach((keyword) => {
				keywords.push({
					slug: keyword,
				});
			});

			filters.push({
				key: 'keywords',
				values: keywords,
			});
		}

		if ('commenters' in queryParams) {
			const commenters = [];

			this.props.queryParams.commenters.split(',').forEach((commenter) => {
				commenters.push({
					slug: commenter,
				});
			});

			filters.push({
				key: 'commenters',
				values: commenters,
			});
		}

		if ('reference' in queryParams) {
			const references = [];

			this.props.queryParams.reference.split(',').forEach((reference) => {
				references.push({
					title: reference,
				});
			});

			filters.push({
				key: 'reference',
				values: references,
			});
		}

		if ('works' in queryParams) {
			const works = [];

			this.props.queryParams.works.split(',').forEach((work) => {
				works.push({
					slug: work,
					title: Utils.capitalize(work),
				});
			});

			filters.push({
				key: 'works',
				values: works,
			});
		}

		if ('subworks' in queryParams) {
			const subworks = [];

			this.props.queryParams.subworks.split(',').forEach((subwork) => {
				const subworkNumber = parseInt(subwork, 10);

				if (!Number.isNaN(subworkNumber)) {
					subworks.push({
						title: subwork,
						n: subworkNumber,
					});
				}
			});


			filters.push({
				key: 'subworks',
				values: subworks,
			});
		}

		if ('lineFrom' in this.props.queryParams) {
			const lineFrom = parseInt(this.props.queryParams.lineFrom, 10);

			if (!Number.isNaN(lineFrom)) {
				filters.push({
					key: 'lineFrom',
					values: [lineFrom],
				});
			}
		}

		if ('lineTo' in this.props.queryParams) {
			const lineTo = parseInt(this.props.queryParams.lineTo, 10);

			if (!Number.isNaN(lineTo)) {
				filters.push({
					key: 'lineTo',
					values: [lineTo],
				});
			}
		}

		if ('wordpressId' in this.props.queryParams) {
			const wordpressId = parseInt(this.props.queryParams.wordpressId, 10);

			if (!Number.isNaN(wordpressId)) {
				filters.push({
					key: 'wordpressId',
					values: [wordpressId],
				});
			}
		}

		return filters;
	},

	_toggleSearchTerm(key, value) {
		const { queryParams } = this.props;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

		const filters = this._createFilterFromQueryParams(queryParams);

		// update filter based on the key and value
		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;
				valueIsInFilter = false;

				filter.values.forEach((filterValue, j) => {
					if (value._id && filterValue._id === value._id) {
						valueIsInFilter = true;
						filterValueToRemove = j;
					} else if (filterValue.slug === value.slug) {
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
			skip: 0,
			limit: 10,
		});

		this._updateRoute(filters);
	},

	_handleChangeTextsearch(e, textsearch) {
		const { queryParams } = this.props;
		const filters = this._createFilterFromQueryParams(queryParams);

		// update filter based on the textsearch
		if (textsearch && textsearch.length) {
			let textsearchInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filters[i].values = [textsearch];
					textsearchInFilters = true;
				}
			});

			if (!textsearchInFilters) {
				filters.push({
					key: 'textsearch',
					values: [textsearch],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this._updateRoute(filters);
	},

	_handleChangeLineN(e) {
		const { queryParams } = this.props;
		const filters = this._createFilterFromQueryParams(queryParams);

		// update filter based on the 'e' attribute
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

		if (e.to < 1000) {
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
			skip: 0,
			limit: 10,
		});
		this._updateRoute(filters);
	},

	loadMoreComments() {
		this.setState({
			limit: this.state.limit + 10,
		});
	},

	showLoginModal() {
		this.setState({
			modalLoginLowered: true,
		});
	},

	closeLoginModal() {
		this.setState({
			modalLoginLowered: false,
		});
	},

	render() {
		const { queryParams } = this.props;
		const { skip, limit, modalLoginLowered } = this.state;

		// create filters object based on the queryParams
		const filters = this._createFilterFromQueryParams(queryParams);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<div className="chs-layout commentary-layout">
						<Header
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							handleChangeLineN={this._handleChangeLineN}
							handleChangeTextsearch={this._handleChangeTextsearch}
							isTest={this.props.isTest}
							initialSearchEnabled
						/>

						<Commentary
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							showLoginModal={this.showLoginModal}
							loadMoreComments={this.loadMoreComments}
							skip={skip}
							limit={limit}
						/>

					</div>
					{modalLoginLowered ?
						<ModalLogin
							lowered={modalLoginLowered}
							closeModal={this.closeLoginModal}
						/>
						: ''
					}
				</div>
			</MuiThemeProvider>
		);
	},

});


export default CommentaryLayout;
