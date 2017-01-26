CommentaryLayout = React.createClass({

	propTypes: {
		queryParams: React.PropTypes.object,
	},

	getInitialState() {
		const filters = this.createFilterFromQueryParams(this.props.queryParams);
		const selectedRevisionIndex = null;

		return {
			filters,
			selectedRevisionIndex,
			modalLoginLowered: false,
		};
	},

	componentDidUpdate() {
		let queryParams = {};
		this.state.filters.forEach((filter) => {
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
					default:
						break;
				}
			});
		});
		if (FlowRouter.path('/commentary/', {}, queryParams) !== FlowRouter.current().path) {
			FlowRouter.go('/commentary/', {}, queryParams);
		}
	},

	getQueryParamValue(queryParams, key, value) {
		let queryParamValue = null;
		if (queryParams[key]) {
			queryParamValue = queryParams[key] + ',' + value;
		} else {
			queryParamValue = value;
		}

		return queryParamValue;
	},

	getFilterValue(filters, key) {
		let value = {};
		if (filters) {
			const filterKey = filters.find((filter) => filter.key === key);
			if (filterKey) {
				value = filterKey.values[0];
			}
		}
		return value;
	},

	createFilterFromQueryParams(queryParams) {
		const filters = [];

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

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

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
			filters,
		});
	},

	handleChangeTextsearch(textsearch) {
		const filters = this.state.filters;

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

		this.setState({
			filters,
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
		return (
			<div>
				<div className="chs-layout commentary-layout">

					<Header
						filters={this.state.filters}
						toggleSearchTerm={this.toggleSearchTerm}
						handleChangeLineN={this.handleChangeLineN}
						handleChangeTextsearch={this.handleChangeTextsearch}
						initialSearchEnabled
					/>

					<Commentary
						filters={this.state.filters}
						toggleSearchTerm={this.toggleSearchTerm}
						loadMoreComments={this.loadMoreComments}
						showLoginModal={this.showLoginModal}
					/>

				</div>
				{this.state.modalLoginLowered ?
					<ModalLogin
						lowered={this.state.modalLoginLowered}
						closeModal={this.closeLoginModal}
					/>
					: ''
				}
			</div>
		);
	},

});
